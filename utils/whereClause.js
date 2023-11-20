class WhereClause{
    constructor(base,bigQ){
        this.base = base;
        this.bigQ = bigQ;

    }

    search()
    {
        const searchWord  = this.bigQ.search ? {
            name:{
                $regex:this.bigQ.search,
                $option:'i'
            }
        }:{}

        this.base = this.base.find({...searchWord})
        return this;
    }
    pager(resultPerPage)
    {
        let currentPage = 1;
        if(this.base.page)
        {
            currentPage=this.base.page;

        }
        const skipVal = resultPerPage * (currentPage-1);
        this.base = this.base.limit(resultPerPage).skip(skipVal);
        return this;
    }

    filter()
    {
        const copyQ = {...this.bigQ};

        delete copyQ["search"];
        delete copyQ["limit"];
        delete copyQ["page"];

        let stringOfCopyQ = JSON.stringify(copyQ);

        stringOfCopyQ = stringOfCopyQ.replace(
            /\b(gte|lte)\b/g,(m)=>`$${m}`
        )

        const jsonCopyQ = JSON.parse(stringOfCopyQ);
        this.base = this.base.find(jsonCopyQ)
        return this;
    }
}

module.exports = WhereClause