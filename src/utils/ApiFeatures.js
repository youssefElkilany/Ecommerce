
 export class apiFeatures {

    constructor(mongooseQuery,reqQuery)
    {
        this.mongooseQuery=mongooseQuery
        this.reqQuery=reqQuery
    }

    paginate(){
       let page = this.reqQuery.page *1 || 1
       let skip = (page-1)*5
       
       if(this.reqQuery.page <= 0)
       {
        page = 1
       }
       this.page = page
       this.mongooseQuery.skip(skip).limit(5)
       return this
    }

    filter(){
        let filterObj = {...this.reqQuery}
        const excludedQueries = ["page","sort","fields","keyword"]
        excludedQueries.forEach(element => {
            delete filterObj[element]
        });

        filterObj = JSON.stringify(filterObj)
        filterObj = filterObj.replace(/\b(gt||gte||lt||lte)\b /g,match=>`$${match}`)
        filterObj = JSON.parse(filterObj)
        console.log(filterObj)
        this.mongooseQuery.find(filterObj)
        return this
    }

    sort(){
        if(this.reqQuery.sort)
        {
            const sortedBy = this.reqQuery.sort.split(',').join('')
            this.mongooseQuery.find(sortedBy)
        }
        return this
    }

    search(){
        if(this.reqQuery.keyword)
        {
        this.mongooseQuery.find({
            $or:{
                name:{
                    $regex: this.reqQuery.keyword,$options:'i'
                },
                description:{
                    $regex:this.reqQuery.keyword,$options:'i'
                }
            }
        })
    }
    return this
}

fields(){
    if(this.reqQuery.fields)
{
    let search = this.reqQuery.fields.split(',').join('')
    mongooseQuery.find(search)
}
return this
}

}