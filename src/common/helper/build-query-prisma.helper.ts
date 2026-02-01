export function buildQueryPrisma(query) {
        let {page,pageSize, filters } = query;
        const pageDefault = 1;
        const pageSizeDefault = 3; 
        
        // Đảm bảo là số 
        page = Number(page);
        pageSize = Number(pageSize);

        // Nếu gửi chữ lên 
        page = Number(page) || pageDefault;
        pageSize = Number(pageSize) || pageSizeDefault ; 

        // Nếu mà gửi số âm 
        page = Math.max(page,pageDefault);
        pageSize = Math.max(pageSize,pageSizeDefault);

        try{
             filters = JSON.parse(filters);
        }catch(err){
            console.log("Thông bc    áo cho FE gửi định dạng json bị sai")
            filters ={};
        }
       // Xử lí filters
        for (const [key,value] of Object.entries(filters)) {
        if (typeof value == "string")
            filters[key] = {
                contains : value,
            }
        }

        const index = (page-1)*pageSize; 

        const where = {
                ...filters,
                isDeleted:false,
        };
    return {
        page,
        pageSize,
        where,
        index,
        filters
    };
}