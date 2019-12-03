/*
Navicat MySQL Data Transfer

Source Server         : 本地连接
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : xm_gameinfo

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2019-12-01 14:54:33
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for attention
-- ----------------------------
DROP TABLE IF EXISTS `attention`;
CREATE TABLE `attention` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '关注表的id',
  `uid` int(8) DEFAULT NULL COMMENT '实行关注的用户id',
  `gzuid` int(8) DEFAULT NULL COMMENT '被关注的用户id',
  PRIMARY KEY (`id`),
  KEY `attentiion_uid` (`uid`),
  KEY `gzuid` (`gzuid`),
  CONSTRAINT `attentiion_uid` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attention_ibfk_1` FOREIGN KEY (`gzuid`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of attention
-- ----------------------------
INSERT INTO `attention` VALUES ('1', '1', '2');
INSERT INTO `attention` VALUES ('2', '1', '3');

-- ----------------------------
-- Table structure for book
-- ----------------------------
DROP TABLE IF EXISTS `book`;
CREATE TABLE `book` (
  `b_id` int(8) NOT NULL AUTO_INCREMENT COMMENT '千楼书活动',
  `uid` int(8) NOT NULL,
  `content` longtext NOT NULL COMMENT '评论内容',
  `time` datetime NOT NULL,
  PRIMARY KEY (`b_id`),
  KEY `uid` (`uid`),
  CONSTRAINT `book_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of book
-- ----------------------------
INSERT INTO `book` VALUES ('1', '1', '有一天它啊', '2019-11-20 11:58:23');
INSERT INTO `book` VALUES ('2', '2', '哈哈哈哈', '2019-11-28 11:58:31');
INSERT INTO `book` VALUES ('3', '2', '3楼', '2019-11-30 12:17:59');
INSERT INTO `book` VALUES ('4', '2', '4楼', '2019-11-30 12:18:36');
INSERT INTO `book` VALUES ('5', '2', '5', '2019-11-30 12:20:10');
INSERT INTO `book` VALUES ('6', '2', '6', '2019-11-30 12:28:07');
INSERT INTO `book` VALUES ('7', '2', '7', '2019-11-30 12:28:12');
INSERT INTO `book` VALUES ('8', '2', '8', '2019-11-30 12:28:17');
INSERT INTO `book` VALUES ('9', '2', '9', '2019-11-30 12:28:26');
INSERT INTO `book` VALUES ('10', '1', '哎呀', '2019-11-30 13:11:59');

-- ----------------------------
-- Table structure for booktxt
-- ----------------------------
DROP TABLE IF EXISTS `booktxt`;
CREATE TABLE `booktxt` (
  `txtid` int(8) NOT NULL AUTO_INCREMENT,
  `uid` int(8) DEFAULT NULL COMMENT '上传书的用户ID',
  `url` varchar(150) DEFAULT NULL COMMENT '书的地址',
  `time` datetime DEFAULT NULL,
  PRIMARY KEY (`txtid`),
  KEY `uid` (`uid`),
  CONSTRAINT `booktxt_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of booktxt
-- ----------------------------
INSERT INTO `booktxt` VALUES ('1', '2', 'public/booktxt/2.txt', '2019-12-01 10:24:51');
INSERT INTO `booktxt` VALUES ('2', '1', 'public/booktxt/1.txt', '2019-12-01 12:20:01');

-- ----------------------------
-- Table structure for chat
-- ----------------------------
DROP TABLE IF EXISTS `chat`;
CREATE TABLE `chat` (
  `chat_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '消息表id',
  `from_id` int(8) NOT NULL COMMENT '信息来自的用户的id',
  `to_id` int(8) NOT NULL COMMENT '信息发送给用户的id',
  `content` varchar(150) NOT NULL COMMENT '消息的内容',
  PRIMARY KEY (`chat_id`),
  KEY `from_id` (`from_id`),
  KEY `to_id` (`to_id`),
  CONSTRAINT `chat_ibfk_1` FOREIGN KEY (`from_id`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chat_ibfk_2` FOREIGN KEY (`to_id`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of chat
-- ----------------------------
INSERT INTO `chat` VALUES ('16', '2', '1', '扛把子你好啊');

-- ----------------------------
-- Table structure for comments
-- ----------------------------
DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments` (
  `comment_id` int(8) NOT NULL AUTO_INCREMENT COMMENT '评论表id',
  `dynamics_id` int(8) NOT NULL COMMENT '动态表的id',
  `content` varchar(100) NOT NULL COMMENT '评论的内容',
  `time` datetime NOT NULL COMMENT '评论的时间',
  `uid` int(8) NOT NULL COMMENT '评论者id',
  PRIMARY KEY (`comment_id`),
  KEY `dynamics_id` (`dynamics_id`),
  KEY `uid` (`uid`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`dynamics_id`) REFERENCES `user_dynamics` (`dynamics_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of comments
-- ----------------------------
INSERT INTO `comments` VALUES ('4', '2', '这才叫玩游戏', '2019-11-05 10:01:07', '1');
INSERT INTO `comments` VALUES ('5', '2', '我怎么样', '2019-11-06 10:01:11', '1');

-- ----------------------------
-- Table structure for controller
-- ----------------------------
DROP TABLE IF EXISTS `controller`;
CREATE TABLE `controller` (
  `cid` int(4) NOT NULL COMMENT '管理者id',
  `cpwd` varchar(50) NOT NULL COMMENT '管理者密码',
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of controller
-- ----------------------------
INSERT INTO `controller` VALUES ('111111', 'Aa123456');
INSERT INTO `controller` VALUES ('111112', 'Aa111111');

-- ----------------------------
-- Table structure for game
-- ----------------------------
DROP TABLE IF EXISTS `game`;
CREATE TABLE `game` (
  `game_id` int(8) NOT NULL COMMENT '游戏id，端游:1XX,手游：2XX,现实：3XX,亲子：4XX',
  `game_name` varchar(26) NOT NULL DEFAULT '' COMMENT '游戏名',
  `type` int(2) NOT NULL COMMENT '游戏的类型',
  `picture` varchar(100) DEFAULT NULL COMMENT '图片',
  `rec_reason` varchar(150) DEFAULT NULL COMMENT '推荐这个游戏的原因',
  `hot` int(2) DEFAULT 0 COMMENT '是否是热门的',
  PRIMARY KEY (`game_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of game
-- ----------------------------
INSERT INTO `game` VALUES ('101', '英雄联盟', '1', 'img/game/1/101/logo.jpg', '', '1');
INSERT INTO `game` VALUES ('102', '绝地求生', '1', 'img/game/1/102/logo.jpg', null, '0');
INSERT INTO `game` VALUES ('103', '穿越火线', '1', 'img/game/1/103/logo.jpg', null, '0');
INSERT INTO `game` VALUES ('104', 'QQ飞车', '1', 'img/game/1/104/logo.jpg', null, '0');
INSERT INTO `game` VALUES ('105', 'DNF', '1', 'img/game/1/105/logo.jpg', null, '1');
INSERT INTO `game` VALUES ('201', '王者荣耀', '2', 'img/game/2/201/logo.jpg', null, '0');
INSERT INTO `game` VALUES ('202', '和平精英', '2', 'img/game/2/202/logo.jpg', null, '1');
INSERT INTO `game` VALUES ('203', '球球大作战', '2', 'img/game/2/203/logo.jpg', null, '0');
INSERT INTO `game` VALUES ('204', '穿越火线', '2', 'img/game/2/204/logo.jpg', null, null);
INSERT INTO `game` VALUES ('205', '开心消消乐', '2', 'img/game/2/205/logo.jpg', null, null);
INSERT INTO `game` VALUES ('206', '捕鱼达人', '2', 'img/game/2/206/logo.jpg', '搜索', '0');
INSERT INTO `game` VALUES ('301', '狼人杀', '3', 'img/game/3/301/logo.jpg', null, '1');
INSERT INTO `game` VALUES ('302', '三国杀', '3', 'img/game/3/302/logo.jpg', null, null);
INSERT INTO `game` VALUES ('303', '宿命', '3', 'img/game/3/303/logo.jpg', null, null);
INSERT INTO `game` VALUES ('304', '百鬼夜行', '3', 'img/game/3/304/logo.jpg', null, null);
INSERT INTO `game` VALUES ('401', '听指令做动作', '4', 'img/game/4/401/logo.jpg', null, null);
INSERT INTO `game` VALUES ('402', '分水果', '4', 'img/game/4/402/logo.jpg', null, null);
INSERT INTO `game` VALUES ('403', '推小球', '4', 'img/game/4/403/logo.jpg', null, null);
INSERT INTO `game` VALUES ('404', '天气预报', '4', 'img/game/4/404/logo.jpg', null, null);

-- ----------------------------
-- Table structure for game_info
-- ----------------------------
DROP TABLE IF EXISTS `game_info`;
CREATE TABLE `game_info` (
  `ginfo_id` int(8) NOT NULL AUTO_INCREMENT COMMENT '游戏资讯id',
  `title` varchar(50) DEFAULT NULL COMMENT '标题',
  `content` longtext DEFAULT NULL COMMENT '游戏资讯的内容',
  `img` varchar(255) DEFAULT '' COMMENT '游戏资讯的图片',
  `time` datetime DEFAULT NULL COMMENT '游戏资讯发布的时间',
  `type` int(2) DEFAULT NULL COMMENT '资讯类型：0新闻、1公告、2活动',
  `link` varchar(150) DEFAULT '' COMMENT '原文地址',
  `source` varchar(20) DEFAULT '',
  PRIMARY KEY (`ginfo_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of game_info
-- ----------------------------
INSERT INTO `game_info` VALUES ('1', 'LOL又一个英雄被The shy打到削弱！上一个被针对的是Faker', '众所周知，拳头经常会因为某个玩家某英雄过强而去削弱他。在此之前，大家印象比较深的就是Faker了。因为Faker削弱的英雄包括劫、反向R闪蛇女、瑞兹等。但是自从The shy S8横空出世以来，在这段时间，拳头官方做得最多的事情，就是削弱The shy玩过的强力英雄。比如剑魔，自从TS天神下凡之后，剑魔一路被砍，成了现在这副模样。还有杰斯，拳头官方曾专门因为TS Q扭头回身接E的操作，而把杰斯改成QE二连的时候无法移动。其他的比如阿卡丽，甚至要被削到改回原版本（暗影之拳）。还有，塞拉斯的回血、刀妹E技能等等，几乎都是针对TS在当时打出了精彩操作而导致的削弱。而就在最近，拳头放出了最新的待削弱名单，在八强赛被TS打出爆炸输出的天使赫然在列！在此之前，众多拿出天使的知名选手表现都不好，也就只有TS打出了效果，没想到天使还是没有逃脱这个命运。大意就是天使的基础伤害从70-250削到60-220，W技能耗蓝全等级提升10点。', 'img/new/new上午9-25-001.jpg', '2019-11-22 15:47:08', '0', 'https://new.qq.com/omn/20191030/20191030A0JWJ100.html', null);
INSERT INTO `game_info` VALUES ('2', 'DNF最稀有的称号，跨3b拍卖行只有一个，售价8亿无人问津', '从60版本开始，称号就是DNF游戏内的重要装备之一，而它的主要作用就是增加玩家们的面板属性。除此之外，还有一些称号是因为其特效动画而受到玩家们的追捧。比如早期的“不灭之王·波罗丁”，绝版的“安徒恩征服者”。以及现在的“天空霸主”，它们都是幻化的热门。当然，每年的各种节日称号也不能被忽视。在五花八门的节日礼包中，最强力的称号莫过于每年的春节称号，尤其是今年的“神选之英杰”，属性堪称是DNF11年之最。这些节日称号不仅可以提高玩家们的伤害，而且还有不错的保值能力。', 'img/new/1.png,img/new/2.png,', null, '0', 'https://pc.baizhan.net/02/20/51183_0.html?chann=02', null);
INSERT INTO `game_info` VALUES ('3', '最难完成的成就，S1到S17，全服仅一人完成', null, null, null, '0', 'https://pc.baizhan.net/02/20/51185_0.html?chann=02', null);
INSERT INTO `game_info` VALUES ('4', '高校联赛海选赛、区域联赛持续报名中 首周精彩赛事大回顾', null, '', null, '1', 'https://pvp.qq.com/web201605/newsDetail.shtml?G_Biz=18&tid=432425', null);
INSERT INTO `game_info` VALUES ('5', '2019年王者荣耀冬季冠军杯赛制与名额规则公布！', null, null, null, '1', 'https://pvp.qq.com/web201605/newsDetail.shtml?G_Biz=18&tid=431136', null);
INSERT INTO `game_info` VALUES ('6', 'XQ成为2019年KPL秋季赛东部赛区第三支锁定季后赛资格队伍', null, null, null, '0', 'https://pvp.qq.com/web201605/newsDetail.shtml?G_Biz=18&tid=432404', null);
INSERT INTO `game_info` VALUES ('7', 'eStar有惊无险击败TES，猫神西施精准控制主宰战场', null, null, null, '0', 'https://pvp.qq.com/web201605/newsDetail.shtml?G_Biz=18&tid=432403', null);
INSERT INTO `game_info` VALUES ('8', '魔法百宝箱10.28大更新 极品永久S三连发！', null, null, null, '2', 'https://speed.qq.com/webplat/info/news_version3/147/14551/14572/14578/m11645/201910/833545.shtml', null);
INSERT INTO `game_info` VALUES ('9', '11月签到来袭，12800点券+永久A车超级战车+永久波斯王椅等你拿！', null, null, null, '2', 'https://speed.qq.com/webplat/info/news_version3/147/14551/14572/14578/m11645/201910/833409.shtml', null);
INSERT INTO `game_info` VALUES ('10', '金秋超值特卖周末登场 精品服饰低至5折来袭', null, null, null, '2', 'https://speed.qq.com/webplat/info/news_version3/147/14551/14572/14578/m11645/201910/833516.shtml', null);
INSERT INTO `game_info` VALUES ('11', '幸运召唤卡、点券卡月末清空公告——10月', null, null, null, '1', 'https://speed.qq.com/webplat/info/news_version3/147/14551/14572/14585/m15538/201905/812017.shtml', null);
INSERT INTO `game_info` VALUES ('12', '对酷比大作战使用恶意外挂的玩家追加处罚公告', null, null, null, '1', 'https://speed.qq.com/webplat/info/news_version3/147/14551/14572/14585/m15538/201910/833302.shtml', null);
INSERT INTO `game_info` VALUES ('13', '聚焦全国公开赛 赛事奖励早知道', null, null, null, '0', 'https://speed.qq.com/webplat/info/news_version3/147/14551/14572/14580/54209/m11645/201910/833452.shtml', null);
INSERT INTO `game_info` VALUES ('14', '测试', '测试', 'img/new/new下午3-34-170.jpg', '2019-11-22 15:34:18', '1', '', '');

-- ----------------------------
-- Table structure for game_strategy
-- ----------------------------
DROP TABLE IF EXISTS `game_strategy`;
CREATE TABLE `game_strategy` (
  `stra_id` int(8) NOT NULL AUTO_INCREMENT COMMENT '攻略id',
  `stra_title` varchar(40) NOT NULL COMMENT '攻略标题',
  `content1` longtext NOT NULL COMMENT '攻略的内容',
  `content2` longtext DEFAULT NULL,
  `content3` longtext DEFAULT NULL,
  `content4` longtext DEFAULT NULL,
  `content5` longtext DEFAULT NULL,
  `picture` varchar(255) DEFAULT NULL COMMENT '攻略的图片',
  `game_id` int(8) NOT NULL COMMENT '游戏id',
  `link` varchar(150) DEFAULT NULL,
  `love` int(5) DEFAULT NULL COMMENT '被点赞的次数',
  `time` datetime NOT NULL COMMENT '发布时间',
  `love_users` longtext DEFAULT '0,',
  PRIMARY KEY (`stra_id`),
  KEY `game_id` (`game_id`),
  CONSTRAINT `game_strategy_ibfk_1` FOREIGN KEY (`game_id`) REFERENCES `game` (`game_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of game_strategy
-- ----------------------------
INSERT INTO `game_strategy` VALUES ('1', '冰雪企鹅岛赛道捷径解析', '隧道中有两个连续的U弯，第二个U弯中间有一条直线近道，能使玩家走到更短的路径，同时近道中有一个加速带和断层带来的空喷落地喷，能得到不错的成绩提升。近道入口临近第二个U弯出口，车手们经常因漂移角度不合适而在过弯后错过近道。建议大家从图中1处开始漂移，使用漂移轨迹更贴近外侧的甩尾漂移，就能使赛车在过弯后车头正对近道。接着调整车身，平跑就可以通过近道。', '跳台跳出的方向与下一个跳台所在位置方向一致，为避免跳得太远，使赛车偏离下一个跳台，建议车手们在跳出前将赛车往外侧稍稍挪动(在空中按方向键会影响落地位置)，这样可以控制好跳跃角度，更稳定地落在下一个跳台上。落地后可以立即触发落地喷提速，但不要使用方向键调整车头。因为在高速下，车头方向稍有偏差，跳出去后赛车的位置就大有差别，所以正对第二个跳台跳出才能避免出现失误。', '这处近道斜着穿过一个直角弯道上，入口并不明显，高速下非常容易被忽略或者延误最佳转向时间导致撞墙。建议车手们以弯道上的企鹅冰雕为参照，近道就在图中所标位置。在近道前车手们往往会释放刚聚满的氮气，此时车速较高，使用方向键难以将车头调整对准近道口。因此车手们可以选择在图中所标位置提前漂移，这次漂移使用小漂即可。一来小漂能完成方向调整进入近道，二来小漂失速不严重，赛车仍然可以快速地通过近道，当然也能在通过上一弯道完靠右侧行驶，然后调整车头方向直接进入近道。', '终点前的平台左侧有一处明显的近道，而近道距离平台较远，但只靠空喷根本飞不上近道。为了可以顺利进入近道，车手们应提前保留一个氮气作为踏上近道使用。在跳台前的直角弯使用甩尾漂移衔接CWW喷再接空喷极速冲上近道。', null, 'img/game/1/104/bx1.jpg,img/game/1/104/bx2.jpg,img/game/1/104/bx3.jpg,img/game/1/104/bx4.jpg', '104', 'http://news.4399.com/qqfc/saidao/pt/m/845414.html', '26', '2019-11-01 17:13:33', '0,1,2,3,');
INSERT INTO `game_strategy` VALUES ('2', '冰火之都赛道技巧解析', '开局后将会遇到连续的三个180度弯道，难度不大。这三个弯道只能算普通的弯道，大家可以随意发挥。通过三个连续弯道后，就是一个较长的有弧度的赛道，这一段也不难，只是有弧度的赛道跑起来有点不习惯而已。通过有弧度的赛道后，就是一个较大的广场，这里有四个出口，从左到右分别是1234出口，我们要走第3个出口，这个是最近的。', '从第3出口出来，刚好就能进入隧道，这也是最短的路程。进入隧道后，我们将来到岩浆的世界，一个急速下坡，在坡底会有小幅度上扬，如果有氮气喷射，则可以通过氮气喷射飞到第二层赛道，如果没有那就在底下第一次赛道也行。这条赛道也是圆弧形的，我们尽量靠左侧驾驶，因为右侧会出现障碍物。', '第二层赛道虽然在弯道处比较近，但是赛道狭窄而且没有护栏，危险还是很大的，所以没必要刻意跑二层赛道。跟着火山内的赛道向前直线行驶，出去后就到达终点了。', null, null, 'img/game/1/104/bh1.jpg,img/game/1/104/bh2.jpg,img/game/1/104/bh3.jpg', '104', 'http://news.4399.com/qqfc/saidao/pt/m/844707.html', '339', '2019-11-13 17:13:38', '0,2,');
INSERT INTO `game_strategy` VALUES ('3', '美洲大峡谷赛道跑法技巧', '不少小伙伴在美洲大峡谷赛道中都被弯道组合区域搞的痛不欲生，这里，小伙伴要切忌一点，那就是在双弯道区域，如果前一个弯道没有漂移成功的话，那就需要立刻调整方向，然后进行持续性的漂移，这样可以成功的征服此区域。还有一点，小伙伴也要尤为注意，如果两个弯道之间距离过短的话，切忌不要使用氮气。因为氮气使用之后赛车的速度会猛然提升，此时小伙伴想要成功的操控赛车过弯是非常困难的。', '弯道需要漂移，这个固定的理念，在美洲大峡谷赛道的部分区域中并不适用。因为美洲大峡谷弯道错综复杂，而且还弯连着弯，最令人郁闷的是两个弯道之间的距离还非常的短。如果小伙伴采用连续漂移过弯的话，不仅会增加过弯的难度，还会浪费大量的时间，从而给对手创造赶超的机会。', '因此，在美洲大峡谷赛道遇到这种复杂的区域之时，最好的通过办法就是从连续的弯道中，寻找出一条完美的路线，然后通过左右方向键小范围的操控赛车，完美的跑过该区域。在操控赛车，通过此区域时不要使用氮气。因为赛车的速度一旦提升，其操控难度就与之增长，这样无疑会提高出现失误的机会。其实，有些时候不漂移比漂移带来的效果还要好，因此小伙伴在赛车之际，要根据赛道的实际情况来选择对应的操作方法。如果在不适合的区域非要进行漂移的话，那结局可能真的会适得其反。', '除了以上的难点之外，美洲大峡谷还有一个难点，那就是从高处降落。一般小伙伴，在从高处降落之后都会存在两个问题，其一是容易失去方向，其二是不知道在降落之前该进行怎样的操作。其实这两个问题非常简单，在美洲大峡谷赛道高处降落之后，小伙伴可以使用小喷，因为氮气的速度提升太快，不利于降落之后的过弯操作。在降落之后，小伙伴可以操控赛车向右侧漂移，因为这样可以快速的调整赛车的方向，让接下来的征程变得更加轻松。', '美洲大峡谷的近道只有三个，其中的而两个不建议大家使用，容易撞车。图中近道非常容易走，配合氮气可快速超越前方不超近道的车辆。如下图，快进入近道时，一定要靠右行驶，可避免碰撞降低速度。', 'img/game/1/104/mz1.jpg,img/game/1/104/mz2.jpg,img/game/1/104/mz3.jpg', '104', 'http://news.4399.com/qqfc/saidao/kn/m/834003.html', '19', '2019-11-03 17:13:43', '0,');
INSERT INTO `game_strategy` VALUES ('4', ' 反向亚特兰蒂斯赛道跑法技巧', '第一个（重点）：这一个超车点在一条隧道的洞口处，很容易被玩家忽略，但是却可以拉开非常大的一段距离，可以使车手少经历一个失误率极高的“S”形弯道。玩家在进入隧道后会遇到一个大半径弯道，在此处建议玩家使用甩尾漂移技巧过弯，不要用氮气，之后立刻向左漂移入近道，此时只要不失误，至少会有一个氮气卡。将车头调整偏左，防止撞到赛道，使用氮气卡提速快速通过这一段赛道。', '第二个：这个超车点位于一条“L”形弯道处，难点在于太窄，而且与前一个“U”形弯道太近，必须在“U”形弯道贴着外道或者用90度的漂移，将车头调整向内道，否则很容易错过这条近道。这条近道相对来说并不是太重要，但也是一些提升，近道过后必须90度漂移，否则会撞到赛道，得不偿失，所以玩家在没有足够把握时不要轻易抄这条近道。', '第三个（重点）：这是一条位于类矩形三连弯的近道，可以节约大量时间，整整少进行两次漂移，属于反向亚特兰蒂斯中非常重要的一条近道。这条近道通过并不难，在接近近道时，将车头微向左侧偏移，不要让赛车撞到近道右边，这样会完全错过这条近道并且会损失大量速度，这是很多车手常出现失误，也是这条近道的难点。', '第四个：这个超车点难度较高，但是会减少玩家两次漂移的时间。风险与机遇成正比，该近道太窄，玩家在没有把握的时候不要轻易尝试，不熟练时可以提前漂移，然后利用停滞漂移拉车尾，提高通过几率。在过这条近道前最好留一个氮气，进入近道后使用可以一路直行，能够发挥这个超车点最大的作用。', null, 'img/game/1/104/yt1.jpg,img/game/1/104/yt2.jpg,img/game/1/104/yt3.jpg,img/game/1/104/yt4.jpg', '104', 'http://news.4399.com/qqfc/saidao/kn/m/833967.html', '72', '2019-11-06 17:13:49', '0,2,');
INSERT INTO `game_strategy` VALUES ('5', '这样出装的伽罗才有资格称为下路霸主，学会上分稳又快！', '首先是铭文方面，这样搭配：夺萃*5+狩猎*5+心眼*10+无双*3+祸源*5+红月*2；推荐理由：这套铭文提供的属性为：移速+5.00%，物理吸血+8.00%，攻击速度+14.20%，暴击率+11.10%，暴击效果+10.80%，法术穿透+64.00。夺萃铭文可以提高伽罗的续航能力；狩猎铭文可以提高伽罗的攻速和一定的移速；心眼铭文可以提高伽罗的攻速和法术穿透；无双和祸源铭文可以提高伽罗的暴击效果和暴击率；红月铭文可以提高伽罗的攻速和暴击率。', '接下来是出装方面：急速战靴（后期名刀·司命、贤者的庇护互换）+闪电匕首（后期换成泣血之刃）+无尽战刃+破晓+末世+影刃；推荐理由：鞋子我们选择急速战靴，可以提高伽罗的攻速和移速，后期我们可以换成名刀·司命和贤者的庇护互换；闪电匕首可以提高伽罗的攻速、暴击率和一定的移速，在后期的时候，我们换成泣血之刃，提高我们的输出和续航能力；无尽战刃可以提高我们的攻击力和暴击率；破晓可以提高我们的攻速和破甲能力；末世可以提高我们的输出、攻速和一定的暴击率；最后我们选择影刃，提高伽罗的攻速、移速和暴击率。', '我们在前期对线的时候，主要是发育为主，我们可以利用2技能和普通来清线发育，毕竟2技能非常容易被躲过去，所以在消耗方面的话，我们主要是利用1技能和普攻的配合来消耗对面英雄血量，但是不管如何，我们只需要在塔前就可以了，因为伽罗没有位移技能，所以也常常成为对面英雄主要针对的目标，而且伽罗还是个C位，当我们在4级后，可以等队友来支援我们，顺便还能给我们提供视野，当队友在草丛中的时候，我们可以先利用1技能和普攻来一波输出伤害,等我们的技能CD恢复以后，我们再打个信号给队友，让队友从后方上前输出', '这时候我们上前一点，只要能够击中就可以，不要靠太前，以免被击中，开大招，提高我们和队友的伤害，随后利用1技能和普攻来一波强势的输出，2技能可以用来收割，也可以用来消耗，如果被击中的话，可以造成沉默效果，我们这一套技能下来，配合队友的输出，可以轻松完成击杀目的，记得在击杀后推塔的时候，一定要让队友给探草丛，确保安全我们再利用兵线推塔。', '我们在后期的时候，这时候的我们，装备都起来了，输出能力非常强，这时候需要跟着队友一起，以免被对面抓单，在团战没开始的时候，我们可以利用2技能和普攻来不断对敌方英雄进行消耗和骚扰，打乱对面的阵型，当我们团战开启后，我们立马配合辅助往后退，以免被对面的英雄针对或者被技能击中，然后直接开大招，给我们提高输出伤害，随后我们再锁定一名英雄来输出。', 'img/game/2/201/jl1.png,img/game/2/201/jl2.png', '201', 'https://pvp.qq.com/web201605/newsDetail.shtml?G_biz=18&tid=430043', '90', '2019-11-28 17:13:53', '0,');
INSERT INTO `game_strategy` VALUES ('6', '空棍、跳棍、存棍，孙悟空这些操作不会，别说是你本命', '孙悟空技能机制比较简单，但是想要玩的出彩就需要用时间来练习了，练习的方向一个是对强化普攻的距离感，一个是对2技能追击、逃生的把握。基本连招，三连棍。孙悟空的基础连招，三次技能，穿插普攻打出最高的输出，这套连招一般是等级太低，技能冷却太慢使用，不过技能的起手和穿插的技能有很大的说道，比方说你打妲己，如果2技能接普攻起手可能就会被晕到逃生，所以可以用1技能无敌躲避妲己的控制，之后2技能近身，就能完美化解。', '通过存棍可以在遇到敌人的时候额外多打出一次强化普攻，一般2技能存，既可以用来赶路，也能时刻准备攻击。走路的时候要存棍，蹲草的时候也要存棍，尽量在下个技能到来之前，而强化普攻消失前发起攻击，这样能最大化自己的输出。通过存棍可以实现秒敲四棍。', '通过存棍，实现伪五连。这套连招需要冷却够多，2技能满级是必须的，在2技能存棍后，强化普攻即将消失的瞬间攻击，且下一个技能必须是2技能起手，这样能更快的转完冷却，在一轮技能打完后，2技能仅剩一秒的冷却时间，可以用来追击或者逃生，我称之为伪五连棍。', '进阶操作，存棍跳兵。使用技能后的强化普攻附带一段位移，那么可以利用这段位移攻击野怪进行追击或者逃生，在攻击到目标的瞬间使用2技能，就能实现隔墙追击、超远距离攻击的操作，像中路抓人的时候就可以用，通过1技能触发强化普攻（后期2技能存棍），瞬间接近兵线后利用2技能跳跃到敌方脸上。', '高级操作，空跳棍。强化普攻命中目标的瞬间，利用2技能的位移继续连跳，甚至没能触发普攻的伤害，这个操作自己仍是“未进入攻击状态”，因此携带疾跑鞋在赶路的时候可以利用这个操作加速，有人说这样的操作比较鸡肋，看上图，手上宗师的光环还没掉，这样的操作可以在接近目标的时候不至于此前丢失宗师的被动而缺失伤害。另外有的时候借力的目标残血，如果拍到了目标就会击杀，2技能没有借力点就无法完成远距离突进。', 'img/game/2/201/wk.gif,img/game/2/201/wk2.gif,img/game/2/201/wk3.gif,img/game/2/201/wk4.gif,img/game/2/201/wk5.gif', '201', 'https://pvp.qq.com/web201605/newsDetail.shtml?G_biz=18&tid=431568', '112', '2019-11-01 17:13:57', '0,');
INSERT INTO `game_strategy` VALUES ('7', '狼人游戏的规则玩法以及高级技巧', '首先依据不同的人数来确定相应的角色：始终不变的抽出一人当法官。剩余7-9人：3个狼人，1个女巫，1个预言家，2-4个普村。10-11个人：4个狼人，1个女巫，1个预言家，1个猎人，3-5个普村。12-13个人：5个狼人，1个女巫，1个预言家，1个猎人，1个守卫，3-4个人普村。下面区分一下对立的两方：坏人方：全体狼人。好人方：除狼人人之外的所有人。胜负的判断准则：狼人赢：好人全部死了，狼人有活口。好人赢：狼人全部被杀死，好人有活口。', '法官：主持整个游戏的人。不参与到具体的游戏之中。口令：总体：天黑请闭眼。指挥狼人：狼人请睁眼。（第一次要加上去：狼人请相互确认身份）。狼人请杀人。（狼人请统一意见）。 狼人请闭眼。指挥女巫：女巫请睁眼。女巫，你有一瓶毒药与一瓶解药，今天晚上他(她)死了，你要救他吗？ 你有一瓶毒药，你要毒死谁吗？女巫请闭眼。指挥预言家：预言家请睁眼。预言家，今天晚上你要验谁的身份？（预言家指人） 如果这个是好人，这个是坏人，那他是这个。（大拇指朝上为好人，朝下为坏人。）预言家请闭眼', '指挥守卫：守卫请睁眼。守卫今天晚上你要守谁？守卫请闭眼。一轮结束死人的话：天亮了，昨天晚上他死了，（可能情况，他也死了）。 一轮结束没人死的话：天亮了，昨天晚上是个风平浪静的夜晚。', '游戏步骤：法官的口令结束后，指出昨天晚上的伤亡情况，然后再进行一轮对话，之后就公投一个最具嫌疑的人，再开始下一轮的游戏。第一轮结束的时候：所有活着的人有两轮对话。而死去的人有遗言，被女巫毒死的人例外。第二轮结束：所有活着的人有一轮对话。而死去的人有遗言，被女巫毒死的人例外。第三轮结束：所有活着的人有一轮对话。而死去的人有遗言，被女巫毒死的人例外。第四轮结束：（7-8人）所有活着的人有一轮对话。而死去的人都没有遗言。（9-12人）所有活着的人有一轮对话。而死去的人有遗言，被女巫毒死的人例外。', '狼人：在天黑的时候负责杀人。不同的轮数可以杀同一个人，但狼人之间一般不可以自相残杀，于情于理不科学。女巫：在整个游戏环节里边只有一瓶毒药，一瓶解药。 在前一轮用了的药，后面几轮都没有的用了。也就是说女巫在整场游戏中，只能救一个人，  毒死一个人。在一轮游戏里可以什么都不做。预言家：在每一轮的环节里，都能验明一个人的身份。守卫：在每一轮中都能守护一个人，但是同一个人不能守第二次。也可以选择不守卫。普通村民：没有任何功能的好人。猎人：被杀死之后可以拖死一个人。', null, '301', 'https://jingyan.baidu.com/article/3f16e003c4eb142591c103d3.html', '547', '2019-11-12 15:21:37', '0,2,');
INSERT INTO `game_strategy` VALUES ('8', '宿命基础入门技巧', '关于怒气 ：怒气系统是《宿命》的核心，怒气是玩家爆发的关键。怒气的获得方式有四种：第一种，也是最常见的一种，即是受到一点伤害则获得一点怒气，所有伤害都将产生怒气，没有例外。第二种，利用基本牌【混乱攻击】，攻击成功后，攻击方会额外获得一点怒气。第三种，利用魔法牌【误导】，可以将怒气在两个玩家之间转移。第四种，装备【黯灭之刃】，你的所有【攻击】成功后，将额外获得一点怒气。怒气的用途 魔法牌的强化，需要消耗一点怒气，当魔法牌强化后，将具有更强大的功能。S技牌的使用，必须消耗2点或3点怒气', '关于身份《宿命》的身份分为天灾，近卫，中立三种，一、各个身份的获胜条件：天灾的任务是消灭近卫，近卫的任务是消灭天灾，中立的任务则是完成自己的“宿命”（若场上有两个中立，则一个中立完成宿命立即获得胜利，另一个中立则游戏失败）。 中立的获胜条件是高于天灾和近卫的，若中立的“宿命”为天灾全灭，当场上天灾全灭时，中立将代替近卫获得胜利，若近卫想要获得胜利，则需先将中立杀死。', '二、身份的辨别 ：游戏开始时，由于英雄的“宿命”有难易程度的区别，所以身份牌的分发是在挑选完英雄牌之后。 一开始你拿到的身份牌是你下家的，查看完毕后则传递给下家并且获得你上家传递下来的身份（你自己的），即你知道你和你下家的身份。你可以通过你上家的行为来判断他是否和你同个阵营，一般情况，如果他对你做出不利的举动，则表明他是你的敌对方，通过他的行为以及他上家的行为，你可以顺时针推出整个场上的局势。你也可以通过你下家的行为来判断你的下下家的身份，逆时针推出整个场上的局势。作为一个高端玩家，你可以通过各种行为迷惑你的下家，使场上的局势朝有利自己的方向进行。', '关于英雄 :每张英雄牌的四个角上都标明了这个英雄的各个特性，分别是类型（分为智力型，敏捷型，力量型，基础版的英雄类型对进行游戏无影响），手牌保留上限，血量上限，怒气上限。英雄技能主要分为三种：主动技能，被动技能，施法技能。 主动技能一般都能被【驱散】（除半人马酋长的【双刃剑】）。 被动技能都不能被【驱散】。 施法技能只能在施法阶段施放，可以被【驱散】，持续一个玩家回合。备注： 游戏概念     一个玩家回合：一名玩家的回合开始到该名玩家的回合结束.', '关于手牌使用的注意点【 攻击】每个玩家回合只能使用一次。 每张魔法牌都具有它的基础功能，触发基础功能无需任何代价，只要使用这张牌即可，而某些魔法牌具有强化功能，强化需要消耗一点怒气。 S技牌必须消耗怒气才能施放。 装备分为武器和防具，且只能同时装备一把武器和一个防具，若需要装备新的，则需弃掉原来的装备。', null, '303', 'https://zhidao.baidu.com/question/212419183.html', '21', '2019-11-01 17:13:57', '0,');
INSERT INTO `game_strategy` VALUES ('9', '百鬼夜行', '1游戏配件：身份牌12张  角色牌19张  转生牌10张  游戏牌170张 ，附加：魂量卡60枚。------2游戏开始，A决定身份 推荐以下选择方式：', 'B获胜条件 ：3个种族决斗：人族胜利条件：杀死所有鬼族与教士，即获胜。鬼族胜利条件：杀死所有人族，则立刻获胜；或者是杀死教士和人，即获胜。教士胜利条件：教士需在人族不死的情况下，先杀死所有鬼族，再净化（杀死）所有人族，即获胜。(注:当场上仍有鬼族身份存活，且人类全部死亡，则教士身份玩家也立刻输掉游戏。)2个种族决斗：消灭所有敌对势力，即获胜。', null, null, null, 'img/game/3/304/bg1.jpg,img/game/3/304/bg2.jpg,img/game/3/304/bg3.jpg,img/game/3/304/bg4.jpg', '304', 'https://wenwen.sogou.com/z/q277728181.htm', '112', '2019-11-20 15:21:42', '0,2,');

-- ----------------------------
-- Table structure for second_comments
-- ----------------------------
DROP TABLE IF EXISTS `second_comments`;
CREATE TABLE `second_comments` (
  `scid` int(8) NOT NULL AUTO_INCREMENT COMMENT '二级评论的id',
  `content` varchar(100) DEFAULT '',
  `time` datetime DEFAULT NULL,
  `uid` int(8) DEFAULT NULL COMMENT '二级评论的用户id',
  `comment_id` int(8) DEFAULT NULL COMMENT '被评论的那条评论的id',
  PRIMARY KEY (`scid`),
  KEY `uid` (`uid`),
  KEY `comment_id` (`comment_id`),
  CONSTRAINT `second_comments_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `second_comments_ibfk_2` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`comment_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of second_comments
-- ----------------------------
INSERT INTO `second_comments` VALUES ('2', '阿拉蕾', '2019-11-29 10:52:06', '1', '4');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `uname` varchar(50) NOT NULL COMMENT '用户名',
  `upwd` varchar(12) CHARACTER SET latin1 NOT NULL COMMENT '用户密码',
  `email` varchar(50) NOT NULL DEFAULT '' COMMENT '电子邮件',
  `phone` varchar(11) CHARACTER SET latin1 NOT NULL COMMENT '电话号码',
  `age` varchar(3) CHARACTER SET latin1 DEFAULT NULL COMMENT '年龄',
  `gender` varchar(2) CHARACTER SET latin1 DEFAULT '' COMMENT '性别，设置了chk_gender约束，只取0或者1的值,不可以为空值',
  `picture` varchar(128) DEFAULT '' COMMENT '头像路径',
  `reg_data` datetime DEFAULT NULL COMMENT '用户注册的时间',
  `introduce` varchar(255) DEFAULT NULL COMMENT '个人介绍',
  PRIMARY KEY (`uid`),
  CONSTRAINT `chk_gender` CHECK (`gender` = '1' or `gender` = '0')
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('1', '青青草原扛把子', 'Aa123456', '110@qq.com', '15107838054', '11', '1', 'img/personal_center/defaultimg.jpg', '2019-10-29 14:56:47', '犹叹当年小蛮腰，看今朝，空余恨，一身五花膘。');
INSERT INTO `users` VALUES ('2', '稳妥', 'Aa123456', '110@qq.com', '15107845678', '20', '1', 'img/personal_center/defaultimg.jpg', '2019-10-30 14:58:17', '略u额uu');
INSERT INTO `users` VALUES ('3', '大蘑菇', '15167876666A', '15167876666@qq.com', '15167876666', null, '0', 'img/personal_center/defaultimg.jpg', null, '谁的人生不是荆棘前行，不要轻言放弃，因为从来没有一种坚持会被辜负。请相信：坚持，终将美好。');

-- ----------------------------
-- Table structure for user_dynamics
-- ----------------------------
DROP TABLE IF EXISTS `user_dynamics`;
CREATE TABLE `user_dynamics` (
  `dynamics_id` int(8) NOT NULL AUTO_INCREMENT COMMENT '帖子id',
  `uid` int(8) NOT NULL COMMENT '发布者的id',
  `content_text` varchar(255) DEFAULT '' COMMENT '标题',
  `picture1` varchar(120) DEFAULT '' COMMENT '发布的图片',
  `picture2` varchar(120) DEFAULT '',
  `picture3` varchar(120) DEFAULT '',
  `comment_num` int(8) DEFAULT NULL COMMENT '评论的人数',
  `type` varchar(2) DEFAULT NULL COMMENT '发布内容的类型，属于什么游戏的的，端游1，手游2，现实3，亲子4，其他为0',
  `creation_time` datetime DEFAULT NULL COMMENT '发布时间',
  `praise_num` longtext DEFAULT 0,
  `love_users` longtext DEFAULT '0,',
  PRIMARY KEY (`dynamics_id`),
  KEY `uid` (`uid`),
  CONSTRAINT `user_dynamics_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user_dynamics
-- ----------------------------
INSERT INTO `user_dynamics` VALUES ('1', '1', '4犹叹当年小蛮腰，看今朝，空余恨，一身五花膘。4犹叹当年小蛮腰，看今朝，空余恨，一身五花膘。4游戏这么玩才对4游的这么玩才对4游戏这么玩才对的则最的的的想，，，游戏这么玩才对4游的这么玩才对4游戏这么玩才对的则最的的的  ', 'img/personal_center/1/a1.jpg', null, null, null, '4', '2019-11-07 20:51:23', '122', '0,1,2,');
INSERT INTO `user_dynamics` VALUES ('2', '1', '得之坦然，失之淡然，争取必然，顺其自然。', '', null, null, null, '4', '2019-11-01 20:51:27', '123', '0,1,2,');
INSERT INTO `user_dynamics` VALUES ('3', '1', '如果你明明知道这个故事的结局，你或者选取说出来，或者装作不知道，万不好欲言又止。有时候留给别人的伤害，选取沉默比选取坦白要痛多了。', null, null, null, null, '4', null, '0', '0,4,');
INSERT INTO `user_dynamics` VALUES ('4', '1', '今天可真棒啊,4犹叹当年小蛮腰，看今朝，空余恨，一身五花膘。', null, null, null, null, '4', null, '1', '0,2,1,');
INSERT INTO `user_dynamics` VALUES ('5', '1', '亲子今天可今天可真棒啊,4犹叹当年小蛮腰，看今朝，空余恨，一身五花膘。真棒啊,4犹叹当年小蛮腰，看今朝，空余恨，一身五花膘。', null, null, null, null, '3', null, '0', '0,');
INSERT INTO `user_dynamics` VALUES ('7', '2', '应是天仙狂醉，乱把浮云揉碎——李白《清平乐.画堂晨起》', null, null, null, null, '3', null, '0', '0,');
INSERT INTO `user_dynamics` VALUES ('8', '2', '我的战斗。用一句话说，就是与陈旧事物之间的战斗，与那些司空见惯的矫情进行战斗，与那些露骨的伪装进行战斗，与那些小气的事和人进行战斗。《人间失格》', null, null, null, null, '1', null, '0', '0,');
INSERT INTO `user_dynamics` VALUES ('9', '2', '其实真正的送别没有长亭古道，没有劝君更尽一杯酒，就是在一个和平时一样的清晨，有的人留在昨天了。”', null, null, null, null, '3', null, '0', '0,');
INSERT INTO `user_dynamics` VALUES ('10', '2', '于千万人之中遇见你所遇见的人，于千万年之中，时间的无涯的荒野里，没有早一步，也没有晚一步，刚巧赶上了，那也没有别的话可说，惟有轻轻地问一声：‘噢，你也在这里嘛？ ——张爱玲《爱》', null, null, null, null, '0', null, '0', '0,');
INSERT INTO `user_dynamics` VALUES ('12', '3', '春暖花会开！如果你曾经历过冬天，那么你就会有春色！如果你有着信念，那么春天一定会遥远；如果你正在付出，那么总有一天你会拥有花开满圆。', null, null, null, null, '2', null, '0', '0,');
INSERT INTO `user_dynamics` VALUES ('13', '3', '柔和的阳光斜挂在苍松翠柏不凋的枝叶上，显得那么安静肃穆，绿色的草坪和白色的水泥道貌岸然上，脚步是那么轻起轻落，大家的心中却是那么的激动与思绪波涌。', null, null, null, null, '2', null, '0', '0,');
INSERT INTO `user_dynamics` VALUES ('14', '3', '一个人回首，或伫足，当季节轮回的时候，心情难免会随着情景而忧伤，不论是现实生活中的种种无奈还是为情，无病呻吟的悲伤已经不是这个时代的主题曲了，而我只有在这个季节听着伤感的音乐沉醉在寂静的时光中，就这样不由自主的痛楚和留恋。', null, null, null, null, '1', null, '0', '0,');
INSERT INTO `user_dynamics` VALUES ('15', '3', '等待是一种痛。忘掉也是一种痛。但不知道该怎么办，是一种更折磨人的痛。', null, null, null, null, '0', null, '0', '0,');
