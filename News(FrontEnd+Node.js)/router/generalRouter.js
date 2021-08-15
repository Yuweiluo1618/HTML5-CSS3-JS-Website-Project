const router = require('express').Router();
const handleDB = require('../db/handleDB');

router.get("/", (req, res)=>{
        (async function(){
            let user_id = req.session["user_id"];
            let search_res = [];

            if(user_id){
                search_res = await handleDB(res, "info_user", "find", "database search error", `id = ${user_id}`);
            }

            let search_cate = await handleDB(res, "info_category", "find", "database searcch error");

            let search__click =  await handleDB(res, "info_news", "sql", "database search error", "select * from info_news order by clicks desc limit 6");
            

            let data = {
                
                user_info: search_res[0]?{
                    nick_name: search_res[0].nick_name,
                    avatar_url: search_res[0].avatar_url
                }:false,
                
                category: search_cate,
                newsClicks: search__click

            }
            
            res.render('news/index', data);
        })(); 
});

router.get('/news_list', (req, res) => {
    
    (async function(){
        
        let {cid = 1, page = 1, per_page = 5} = req.query;
        let wh = cid == 1? `1`:`category_id = ${cid}`;
        let search_res = await handleDB(res, "info_news", "limit", "database search error", {
            where: `${wh} order by create_time desc`,
            number: page,
            count: per_page
        })

        let total_page_res = await handleDB(res, "info_news", "sql", "database search error", `select count(*) from info_news where ${wh}`);
        // console.log(typeof page);
        let totalPage = total_page_res[0]['count(*)'];
        // console.log(typeof total_page);
        


        res.send({
            newsList: search_res,
            totalPage,
            currentPage: Number(page)
        })

    })();
 


});

module.exports = router;