const router = require('express').Router();
const commen = require('../utils/common');
const constant = require('../utils/constant');
const handleDB = require('../db/handleDB');

router.get("/", (req, res)=>{
        (async function(){
        
            let user_info = await commen.getUser(req, res);

            let search_cate = await handleDB(res, "info_category", "find", "database searcch error");

            let search__click =  await handleDB(res, "info_news", "sql", "database search error", "select * from info_news order by clicks desc limit 6");
            

            let data = {
                
                user_info: user_info[0]?{
                    nick_name: user_info[0].nick_name,
                    avatar_url: user_info[0].avatar_url?(constant.FILE_NAME_PRE+user_info[0].avatar_url):"/news/images/person01.png"
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
        let totalPage = Math.ceil(total_page_res[0]['count(*)']/per_page);
        // console.log(typeof total_page);
        


        res.send({
            newsList: search_res,
            totalPage,
            currentPage: Number(page)
        })

    })();
 


});

module.exports = router;