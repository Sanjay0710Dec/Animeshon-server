import { SuccessResponseSchema } from "@/types/response";

class SuccessResponse<T=any> {
    success:boolean = true;
    data:{
        message:string,
        result:T
    }
    constructor(data:SuccessResponseSchema<T>){
        this.data = data;
    }
}


export default SuccessResponse;