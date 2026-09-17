import { authenticate,view } from "@/lib/workmap/service";
import { getSession } from "@/lib/workmap/store";
import { subscribeToSession } from "@/lib/workmap/events";
export const runtime="nodejs";
export const maxDuration=180;
export async function GET(request:Request){
  const session=await authenticate(request);
  if(!session)return Response.json({error:"Unauthorized"},{status:401});
  const abort=new AbortController(),encoder=new TextEncoder();let close=()=>{};
  const stream=new ReadableStream({
    start(controller){
      let ended=false,version=-1;
      const finish=()=>{if(ended)return;ended=true;clearTimeout(deadline);abort.abort();controller.close();};
      close=finish;
      // A reconnect at the host's connection deadline opens another subscription,
      // not a periodic request to query status. The new snapshot recovers missed events.
      const deadline=setTimeout(finish,140000);
      request.signal.addEventListener("abort",finish,{once:true});
      controller.enqueue(encoder.encode("retry: 3000\n\n"));
      const changed=async()=>{
        if(ended)return;const s=await getSession(session.id);if(ended)return;
        if(!s){finish();return;}
        if(s.version>version){version=s.version;controller.enqueue(encoder.encode(`data: ${JSON.stringify(view(s))}\n\n`));}
        if(s.state === "ready" || (s.state === "failed" && (s.job?.attempts ?? 5) >= 5))finish();
      };
      void subscribeToSession(session.id,changed,abort.signal).catch(()=>{
        if(!ended)controller.enqueue(encoder.encode("event: interrupted\ndata: {}\n\n"));
      }).finally(finish);
    },
    cancel(){close();},
  });
  return new Response(stream,{headers:{"Content-Type":"text/event-stream","Cache-Control":"private, no-store, no-transform","X-Accel-Buffering":"no","X-Robots-Tag":"noindex","Referrer-Policy":"no-referrer"}});
}
