import express from "express";
import {aj} from "../config/arcjet";
import arcjet,{ArcjetNodeRequest,slidingWindow} from "@arcjet/node";

const securityMiddleware = async( req: express.Request, res: express.Response, next: express.NextFunction) => {
        if ( process.env.NODE_ENV === 'test' ) return next();

        try {

            const role:RateLimitRole = req.user?.role ?? "guest";

            let limit:number;
            let message:String;
            switch (role) {
                case "admin":
                    limit = 20;
                    message=' admin request limit exceeded';
                    break;
                    case "teacher":
                case "student":
                    limit = 10;
                    message=' user request limit exceeded';
                    break;
                default:
                    limit = 5;
                    message=' guest request limit exceeded';
                    break;

            }

                const client = aj.withRule(
                    slidingWindow(
                        {
                            mode: "LIVE",
                            interval: '1m',
                            max: limit,
                        }
                    )
                )
            const arcjetRequest : ArcjetNodeRequest = {
                headers: req.headers,
                method: req.method,
                url: req.originalUrl ?? req.url,
                socket : {remoteAddress: req.socket.remoteAddress ?? req.ip ?? '0.0.0.0'},
            }
            const decision = await client.protect(arcjetRequest);

            if(decision.isDenied() && decision.reason.isBot()){
                return res.status(403).json({ error: 'Forbidden' , message: 'Automated requests are not allowed'});
            }
            if(decision.isDenied() && decision.reason.isShield()){
                return res.status(403).json({ error: 'Forbidden' , message: 'Request blocked by security policy'});
            }
            if(decision.isDenied() && decision.reason.isRateLimit()){
                return res.status(429).json({ error: 'Forbidden' , message});
            }
            next();

        }catch (e) {
            console.error('Arcjet middlware error',e);
            res.status(500).json( {error : 'Internal Server Error' , message : 'Something went wrong with arcjet security'}  );
        }
}
export default securityMiddleware;