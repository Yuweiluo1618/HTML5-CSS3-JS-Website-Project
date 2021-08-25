const router = require('express').Router();
const handleDB = require('../db/handleDB');
const moment =  require("moment");
const common = require('../utils/common');
require('../utils/filter');

router.get('/news_detail/:news_id', (req, res) => {

    (async function(){

        let user_info = await common.getUser(req, res);
        
        let search_click =  await handleDB(res, "info_news", "sql", "database search error", "select * from info_news order by clicks desc limit 6");

        let {news_id} = req.params;

        let newsResult = await handleDB(res, "info_news", "find", "database search error", `id = ${news_id}`);

        if(!newsResult[0]){
            common.abort404(req, res);
            return;
        }

        let is_collection = false;
        
        if(user_info[0]){
            let collection_res = await handleDB(res, "info_user_collection", "find", "database search error", `user_id = ${user_info[0].id} and news_id = ${news_id}`);
            if(collection_res[0]){
                is_collection = true;
            }
        }

        newsResult[0].clicks += 1;

        await handleDB(res, "info_news", "update", "database update error", `id = ${news_id}`, {clicks: newsResult[0].clicks});


        let comment_res = await handleDB(res, "info_comment", "find", "database search error", `news_id = ${news_id} order by create_time desc`);

        for(let i = 0; i < comment_res.length; i++){
            
            let commenter_search_res = await handleDB(res, "info_user", "find", "database search error", `id = ${comment_res[i].user_id}`);

            if(comment_res[i].parent_id){
                let parent_comment_search_res = await handleDB(res, "info_comment", "find", "database search error", `id = ${comment_res[i].parent_id}`);
                let parent_info_search_res = await handleDB(res, "info_user", "find", "database search error", `id = ${parent_comment_search_res[0].user_id}`);
                comment_res[i].parent ={
                    user: {
                        nick_name: parent_info_search_res[0].nick_name 
                    },
                    content: parent_comment_search_res[0].content
                }
            }

            comment_res[i].commenter = {
                nick_name: commenter_search_res[0].nick_name,
                avatar_url: commenter_search_res[0].avatar_url?commenter_search_res[0].avatar_url:"/news/images/worm.jpg"
            }
        }

        let user_thump_up = await handleDB(res, "info_comment_like", "find", "database search error", `user_id = ${user_info[0].id}`);
        console.log(user_thump_up);
        

        let data = {

            user_info: user_info[0]?{
                nick_name: user_info[0].nick_name,
                avatar_url: user_info[0].avatar_url
            }:false,
            newsClicks: search_click,
            newsData: newsResult[0],
            is_collection,
            commentList: comment_res,
            user_thump_up
        }


        res.render("news/detail", data);
    })();


    
});

router.post('/news_detail/news_collect', (req, res) => {
    (async function(){
        
        let user_info = await common.getUser(req, res);
        if(!user_info[0]){
            res.send({errno: "4101", errmsg: "user need login"});
            return;
        }

        let {news_id, action} = req.body;

        if(!news_id || !action){
            res.send({errmsg: "prams are not matching"});
            return;
        }

        let news_id_search_res = await handleDB(res, "info_news", "find", "database search error", `id = ${news_id}`);

        if(!news_id_search_res[0]){
            res.send({errmsg: "news not exist"});
            return;
        }

        
        if(action === "collect"){

            let insertRes = await handleDB(res, "info_user_collection", "insert", "database insert error",{user_id: user_info[0].id, news_id: news_id});
        }
        else{
            
            let deleteRes = await handleDB(res, "info_user_collection", "delete", "database delete error", `user_id = ${user_info[0].id} and news_id = ${news_id}`);
        }

        res.send({errno: "0"})


        

    })();
});

router.post('/news_detail/news_comment', (req, res) => {
    (async function(){
       
        let user_info = await common.getUser(req, res);
        
        if(!user_info[0]){
            res.send({errno: "4101", errmsg: "user need login"});
            return;
        }

        let {news_id, comment, parent_id = null} = req.body;

        if(!news_id || !comment){
            res.send({errmsg: "prams are not matching"});
            return;
        }

        let news_id_search_res = await handleDB(res, "info_news", "find", "database search error", `id = ${news_id}`);

        if(!news_id_search_res[0]){
            res.send({errmsg: "news not exist"});
            return;
        }

        let commentObj = {
            user_id: user_info[0].id,
            news_id,
            content: comment,
            create_time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        };

        if(parent_id){
            commentObj.parent_id = parent_id;
            var commenter_res = await handleDB(res, "info_comment", "find", "database search error", `id = ${parent_id}`);
            var commenter_info = await handleDB(res, "info_user", "find", "database search error", `id = ${commenter_res[0].user_id}`);
        }

        let commet_insert_res = await handleDB(res, "info_comment", "insert", "database insert error", commentObj);

        let data = {
            user:{
                avatar_url: user_info[0].avatar_url,
                nick_name: user_info[0].nick_name
            },
            content: comment,
            create_time: commentObj.create_time,
            news_id,
            id: commet_insert_res.insertId,
            parent: parent_id?{
                user: {
                    nick_name: commenter_info[0].nick_name
                },
                content:  commenter_res[0].content
            }:null
        }

        res.send({errno: '0', errmsg: "comment successfully", data})


    })();
});

router.post('/news_detail/comment_like', (req, res) => {
    (async function(){
        
        let user_info = await common.getUser(req, res);

        if(!user_info[0]){
            res.send({errno: "4101"});
            return
        }

        let {comment_id, action} = req.body;

        if(!comment_id || !action){
            res.send({errmsg: "prams are not matching"});
            return;
        }

        let comment_serch_res = await handleDB(res, "info_comment", "find", "database search error", `id = ${comment_id}`);

        if(!comment_serch_res[0]){
            res.send({errmsg: "comment not exist"});
            return;
        }

        if(action === "add"){
            await handleDB(res, "info_comment_like", "insert", "database insert error", {comment_id, user_id: user_info[0].id});
            var like_count = comment_serch_res[0].like_count?comment_serch_res[0].like_count+1:1;
        }
        else{
            await handleDB(res, "info_comment_like", "delete", "database delete error", `comment_id = ${comment_id} and user_id = ${user_info[0].id}`);
            like_count = comment_serch_res[0].like_count?comment_serch_res[0].like_count-1:0;
        }
        
        await handleDB(res, "info_comment", "update", "database update error", `id = ${comment_id}`, {like_count});

        res.send({errno: "0", errmsg: "thump up successful"})


    })();
});


module.exports = router;