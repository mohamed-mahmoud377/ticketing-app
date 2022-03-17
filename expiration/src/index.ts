
import {natsWrapper} from "./nats/nats-wrapper";
import {OrderCreatedListener} from "./events/listeners/order-created-listener";

const startUpDBConnection = async ()=>{


    if (!process.env.NATS_CLIENT_ID){
        throw new Error("NATS_CLIENT_ID must be defined !")
    }
    if (!process.env.NATS_URL){
        throw new Error("NATS_URL must be defined !")
    }
    if (!process.env.NATS_CLUSTER_ID){
        throw new Error("NATS_CLUSTER_ID must be defined !")
    }


    try{
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID,process.env.NATS_CLIENT_ID,process.env.NATS_URL)
        natsWrapper.client.on('close',()=>{
            console.log("NATS connection closed !")
            process.exit();
        })
        new OrderCreatedListener(natsWrapper.client).listen();
                // why are we doing this ?
        // because when the program close NATS still try to reach it but we closed ! like on purpose
        // so in the closing process we tell NATS that we want to close the connection immediately
        // so we don't waste time trying  to reach it
        process.on('SIGINT',()=>natsWrapper.client.close()); // this for when you close the program with ctrl z
        process.on('SIGTERM',()=>natsWrapper.client.close()); // this when docker tries to kill the process gracefully


    }catch (e) {
        console.log(e)
    }

}

startUpDBConnection()






