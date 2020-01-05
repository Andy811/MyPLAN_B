var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var passport = require('passport');
var router = express.Router();

var one_week = new Array(7)//一個禮拜的日期
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
  var con = mysql.createConnection({ //con在get外可能會出錯
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
    // var dates = Array(7) 移到外面變成屬性試試

    for (i = 0; i < 7; i++) {
      one_week[i] = getFormatDate(date + i)  // (2)
    }
    return one_week
  }

  var One_WeekData = new Array(7);
  var today = new Date();
  var sql_data = {}
  one_week = setMyDate(today.getDate())//預設日期   
  function setOneDayData(i, day) {
    var array_starttime = ['7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']
    //var One_DayData = new Array(11);  
    for (t = 0; t < array_starttime.length; t++) {
      if (sql_data.reservation[i].starttime == array_starttime[t]) {
        for (j = 0; j < sql_data.reservation[i].section; j++) {
          day[t + j] = sql_data.reservation[i].meetingName;
        }
      }
    }
    return day
  }

  function setOneWeekData(i, WeekArray) {
    var Data_1 = new Array(11);
    var Data_2 = new Array(11);
    var Data_3 = new Array(11);
    var Data_4 = new Array(11);
    var Data_5 = new Array(11);
    var Data_6 = new Array(11);
    var Data_7 = new Array(11);
    if (sql_data.reservation[i].opendate == WeekArray[0]) {
      One_WeekData[0] = setOneDayData(i, Data_1)
     // console.log('第一天的會議', One_WeekData[0])
    } if (sql_data.reservation[i].opendate == WeekArray[1]) {
      console.log('第二天的會議', setOneDayData(i))
      One_WeekData[1] = setOneDayData(i, Data_2)
    } if (sql_data.reservation[i].opendate == WeekArray[2]) {
      console.log('第三天的會議', sql_data.reservation[i])
      One_WeekData[2] = setOneDayData(i, Data_3)
    } if (sql_data.reservation[i].opendate == WeekArray[3]) {
      console.log('第四天的會議', sql_data.reservation[i])
      One_WeekData[3] = setOneDayData(i, Data_4)
    } if (sql_data.reservation[i].opendate == WeekArray[4]) {
      console.log('第五天的會議', sql_data.reservation[i])
      One_WeekData[4] = setOneDayData(i, Data_5)
    } if (sql_data.reservation[i].opendate == WeekArray[5]) {
      console.log('第六天的會議', sql_data.reservation[i])
      One_WeekData[5] = setOneDayData(i, Data_6)
    } if (sql_data.reservation[i].opendate == WeekArray[6]) {
      console.log('第七天的會議', sql_data.reservation[i])
      One_WeekData[6] = setOneDayData(i, Data_7)
    }

  }

  //一進去reservation就出現的表格 一號會議室 日期當天
  function setTable(WeekArray,roomID) {
    con.query("select roomID,section,starttime,endTime,DATE_FORMAT(opendate," + "'" + "%Y/%m/%d" + "'" + ") as opendate,department,meetingID,meetingName from reservation where "
      + "datediff(opendate," + "'" + WeekArray[0] + "'" + ")<=7 " + " and datediff('" + WeekArray[0] + "',opendate) <=0" + " and" + " roomID =" +  "'"+roomID+"'" , function (err, rows) { //利用sql select一個日期七天之內的資料
        sql_data.reservation = rows;

        console.log('sql_data.reservation', sql_data.reservation)
        
          for(i=0;i<One_WeekData.length;i++){
            
            if(One_WeekData[i]==null){
              One_WeekData[i]=''
            }
          }   
          
        for (i = 0; i < sql_data.reservation.length; i++) {
          setOneWeekData(i, WeekArray)
        }
        console.log('全部資料', One_WeekData)
      });
  }
  setTable(one_week)





  app.get('/reservation', isLoggedIn, function (req, res) {

    var roomid = req.body.room_search
    var search_date = req.body.searchdate
    console.log(roomid)
    res.render('reservation.ejs', {
      user: req.user,
      table_day: setWeek(today.getDay()),
      table_date: one_week,
      roomID: roomid,
      date: search_date,
      data: One_WeekData,
      roomID:'一號會議室'
    });
  });

  //查詢的動作
  app.post('/datainsert', isLoggedIn, function (req, res) {

    one_weekData = new Array(7)
    var search_room = req.body.meetingroom
    var search_date = req.body.searchdate
    var new_date = new Date(search_date)
    var new_one_week = setMyDate(new_date.getDate()) //一個禮拜的日期陣列
    setTable(new_one_week,search_room)
    
    
    res.render('reservation.ejs', {
      user: req.user,
      table_day: setWeek(new_date.getDay()),
      table_date: one_week,
      
      data: One_WeekData,
      date: search_date,
      roomID: search_room
    });
    
  });
};
console.log("one_weekData",one_week.length)




// console.log(con);
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');

}
