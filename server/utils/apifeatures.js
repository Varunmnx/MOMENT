import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class Apifeatures {
  constructor(query, querystr) {
    this.query = query;
    this.querystr = querystr;
  }

  async filter() {
            let copyqry = { ...this.querystr };
            if (copyqry.keyword || copyqry.category) {
                        this.query = await this.searchwithkeyandcat(copyqry.keyword,copyqry.category)     
            } else if(!copyqry.keyword || !copyqry.category){
                        this.query = await prisma.products.findMany();
            }

  //pagination
            if (copyqry.page ) {
    
                            this.query = this.paginate(copyqry.page,5)
                }

    return this;
  }


//for fetching products with keyword and category
async searchwithkeyandcat(keyword,category){
   console.log("___apifeatures___32")
   let result =  await prisma.products.findMany({
                                                    where: {
                                                    OR: [
                                                        {
                                                        name: {
                                                            contains: keyword,
                                                            mode: "insensitive",
                                                        },
                                                        category: category,
                                                        },
                                                        {
                                                        description: {
                                                            contains: keyword,
                                                            mode: "insensitive",
                                                        },
                                                        category: category,
                                                        },
                                                    ],
                                                    },
                                                });
  return result
}



paginate(page,limit){
    let start = Number(page)
    let all = this.query
    let skip = Number(start) +Number(limit)
    let end = skip < all.length? skip :all.length -1
    return this.query.slice(start, end);
}

}
