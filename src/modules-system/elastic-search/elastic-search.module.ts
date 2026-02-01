import { Global, Module, OnModuleInit } from "@nestjs/common";
import { ElasticsearchModule, ElasticsearchService } from "@nestjs/elasticsearch"
import { ELASTIC_SEARCH_PASSWORD, ELASTIC_SEARCH_URL, ELASTIC_SEARCH_USERNAME } from "src/common/constant/app.constant";

@Global()
@Module({
    imports:[
        ElasticsearchModule.register({
            node:ELASTIC_SEARCH_URL,
            auth: {
                username: ELASTIC_SEARCH_USERNAME!,
                password: ELASTIC_SEARCH_PASSWORD!
            },
            tls: {
                rejectUnauthorized: false,
            },
        })],
    exports: [
        ElasticsearchModule,
    ],
})
export class ElasticSearchModule implements OnModuleInit {

    constructor(private elasticSearch:ElasticsearchService) {}
    
    async onModuleInit(){
        // Kiểm tra kết nối 
        try{
            const result = await this.elasticSearch.ping();
            console.log("ĐÃ KẾT NỐI ELASTIC THÀNH CÔNG ",result);
        }catch(error){
            console.log("KẾT NỐI THẤT BẠI ELASTIC ",error)
        }
    }
 }