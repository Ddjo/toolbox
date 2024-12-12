import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { throwError } from "rxjs";

@Catch(HttpException)
export class RpcValidationFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        console.log('RpcValidationFilter : ', exception.getResponse());
        // throw new RpcException(exception.getResponse())
        return throwError(() => exception.getResponse());
    }
}
