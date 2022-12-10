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
                         console.log("___api__features__13")
                        this.query = await this.searchwithkeyandcat(copyqry.keyword,copyqry.category)
                        console.log("runned");
            } else if(!copyqry.keyword || !copyqry.category){
                        this.query = await prisma.products.findMany();
                        console.log("runned 17")
            }

  //pagination
            if (copyqry.page && copyqry.limit) {
                            this.query = this.paginate(copyqry.page,copyqry.limit)
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
    let start = (page - 1) * 10;
    let end = page * limit;
    return this.query.slice(start, end);
}

}
