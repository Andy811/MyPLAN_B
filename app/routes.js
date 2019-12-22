var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var passport = require('passport');
var router = express.Router();



module.exports = function (app) {
  app.get(/(.*)\.(jpg|gif|png|ico|css|js|txt)/i, function (req, res) {
    res.sendfile(__dirname + "/" + req.params[0] + "." + req.params[1], function (err) {
      if (err) res.send(404);
    });
  });



  app.get('/', function (req, res) {
    res.render('login', { message: req.flash('loginMessage') });
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/homepage',
    failureRedirect: '/error',
    failureFlash: true
  }),
    function (req, res) {
      if (req.body.remember) {
        req.session.cookie.maxAge = 1000 * 60 * 3;
      } else {
        req.session.cookie.expires = false;
      }
      res.redirect('/');
    });
  app.get('/error', function (req, res) {
    res.render('error', {

    });
  });
  app.get('/errorre', function (req, res) {
    res.render('errorinreservation', {

    });
  });

  app.get('/complete', function (req, res) {
    res.render('complete', {

    });
  });
  //homepae.ejs
  app.get('/homepage', isLoggedIn, function (req, res) {
    res.render('homepage', { user: req.user });
  });
  app.get('/checkin', isLoggedIn, function (req, res) {
    res.render('checkin', {
      user: req.user
    });
  });

  app.get('/edit', isLoggedIn, function (req, res) {
    res.render('edit', {
      user: req.user
    });
  });
  app.get('/record', isLoggedIn, function (req, res) {
    res.render('record', {
      user: req.user
    });
  });
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  })
  //reservation.ejs insert and search
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "nodejs_login",
  });

  //輸入索引值(0,1,2,3,4,5,6)會回傳星期幾
  function setWeek(inputDay) {
    var d = new Date()
    var weekday = new Array(7)
    var day = Array()

    weekday[0] = "星期日"
    weekday[1] = "星期一"
    weekday[2] = "星期二"
    weekday[3] = "星期三"
    weekday[4] = "星期四"
    weekday[5] = "星期五"
    weekday[6] = "星期六"

    var j = 0;

    for (i = 0; i < weekday.length - inputDay; i++) {
      day[i] = weekday[inputDay + i];
    }
    while (day.length < weekday.length) {
      day[day.length] = weekday[j];
      j += 1;
    }

    return day
  }
  //輸入這個月的第幾天 day.seyDay(幾號) 會回傳yyyy/mm/dd格式的日期 
  function getFormatDate(setDate) {
    var date = new Date();
    date.setDate(setDate);
    var seperator = "/";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator + month + seperator + strDate;
    return currentdate;
  }

  //輸入 本月的第幾天 會回傳七天日期的陣列
  function setMyDate(date) {
    var dates = Array(7)

    for (i = 0; i < 7; i++) {

      dates[i] = getFormatDate(date + i)  // (2)
    }
    return dates
  }

  var today = new Date();


  app.get('/reservation', isLoggedIn, function (req, res) {
    var roomid = req.body.room_search
    var search_date = req.body.searchdate
    console.log(roomid)
    res.render('reservation.ejs', {
      user: req.user,
      data: '哭哭哭哭哭哭阿',
      table_day: setWeek(today.getDay()),
      table_date: setMyDate(today.getDate()),
      roomID: '哭哭阿',
      roomID: roomid,
      date: search_date
    });
  });



  app.post('/datainsert', urlencodedParser, function (req, res) {
    var search_room = req.body.meetingroom
    var search_date = req.body.searchdate   
    var new_date = new Date(search_date)
    res.render('reservation.ejs',
      {
        user: req.user,

        data: '哭哭哭哭哭哭阿',
        table_day: setWeek(new_date.getDay()),
        table_date: setMyDate(new_date.getDate()),
        roomID: '哭哭阿',
        roomID: search_room,
        date: search_date
      })
    

    //var data = {};
    //var sqlforsearch = 'select * from reservation where (roomid="'+ searchroom +'" OR starttime="'+ searchstart +'"OR endtime="'+ searchend +'"OR opendate="'+ searchdate +'"OR department="'+ searchdepartment +'"OR meetingname="'+ searchtopic +'")'
    //var sqlforsearch = 'select meetingName from reservation where opendate='+searchdate
    //測試
    /*
    var sqlforsearch = 'select ,eetingName from reservation where ' +
      con.query(sqlforsearch, function (err, rows) {
        console.log('搜尋結果', rows);

        data.reservation = rows;

        data.reservation = rows;
        if (err) {
          res.redirect('errorre');
        } else {
          res.render('searchpage', { data: data.reservation });
        }
      })
      */
  });



  /*
   app.post('/datainsert', urlencodedParser, function (req, res) {
     console.log(req.body);
     var con = mysql.createConnection({
       host: "localhost",
       user: "root",
       password: "123456",
       database: "nodejs_login",
     });
 
     con.connect(function (err) {
       var start = req.body.StartTime
       var end = req.body.endtime
       var room = req.body.meetingroom
       var MeetingDate = req.body.opendate
       var department = req.body.department
       var meetingname = req.body.meetingname
       if (err) throw err;
       console.log("Connected!");
       var sql = "INSERT INTO reservation (roomid,starttime,endtime,opendate,department,meetingname,meetingid ) VALUES ('" + room + "','" + start + "' ,'" + end + "','" + MeetingDate + "','" + department + "','" + meetingname + "',000)";//meetingid暫用
       console.log(sql);
       con.query(sql, function (err, result) {
         console.log(result);
         
                 if (err) {
                   res.redirect('errorre')
                 } else {
                   res.redirect('complete')
                 }
       });
     });
   });*/
};




// console.log(con);
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');

}
