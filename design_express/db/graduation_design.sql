/*
Navicat MySQL Data Transfer

Source Server         : system
Source Server Version : 50562
Source Host           : localhost:3306
Source Database       : graduation_design

Target Server Type    : MYSQL
Target Server Version : 50562
File Encoding         : 65001

Date: 2020-05-23 16:53:24
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for address
-- ----------------------------
DROP TABLE IF EXISTS `address`;
CREATE TABLE `address` (
  `addr_id` int(11) NOT NULL AUTO_INCREMENT,
  `phone` bigint(11) DEFAULT NULL COMMENT '用户账户',
  `real_name` varchar(20) DEFAULT NULL COMMENT '收货人姓名',
  `real_phone` bigint(11) DEFAULT NULL COMMENT '收货人电话',
  `province` varchar(20) DEFAULT NULL COMMENT '省份',
  `city` varchar(20) DEFAULT NULL COMMENT '城市',
  `district` varchar(50) DEFAULT NULL COMMENT '区县',
  `detail` varchar(255) DEFAULT NULL COMMENT '详细地址',
  `is_default` int(255) DEFAULT '0' COMMENT '是否默认',
  PRIMARY KEY (`addr_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of address
-- ----------------------------
INSERT INTO `address` VALUES ('1', '13078030746', '木头人', '13078030746', '广东省', '云浮市', '云安区', '洛溪村康宁西路29号', '1');
INSERT INTO `address` VALUES ('2', '13078030746', '桦桦', '13345678907', '上海市', '市辖区', '黄浦区', '云城大道东门菜鸟驿站', '0');
INSERT INTO `address` VALUES ('3', '13078030746', '萌萌', '13078030746', '江苏省', '南京市', '玄武区', '如家酒店大堂处', '0');
INSERT INTO `address` VALUES ('4', '13078030746', '熊二', '13333333333', '吉林省', '长春市', '南关区', '小旭旭', '0');
INSERT INTO `address` VALUES ('5', '13078030746', '大猫', '13444444443', '辽宁省', '沈阳市', '和平区', '顶顶顶顶', '0');
INSERT INTO `address` VALUES ('7', '13000000000', '2hang', '13088800000', '辽宁省', '沈阳市', '和平区', '菜鸟驿站', '0');
INSERT INTO `address` VALUES ('8', '13000000000', '大猫', '13000000000', '上海市', '市辖区', '静安区', '自如30号丰巢快递柜子', '1');

-- ----------------------------
-- Table structure for carousel
-- ----------------------------
DROP TABLE IF EXISTS `carousel`;
CREATE TABLE `carousel` (
  `indexCarousel` varchar(255) DEFAULT NULL COMMENT '首页轮播图',
  `ListCarousel` varchar(255) DEFAULT NULL COMMENT '测试字段'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of carousel
-- ----------------------------
INSERT INTO `carousel` VALUES ('http://img1.lukou.com/static/coupon/p/image_link/QjzRd520nU8RciyPAVxIzar1LOWcvx0S.jpeg,http://img1.lukou.com/static/coupon/p/image_link/kQLE6VhmCBY85AyukV6Bd3wKyQ4EC1LH.jpeg,http://img1.lukou.com/static/coupon/p/image_link/kQLE6VhmCBY85AyukV6Bd3wKyQ4EC1LH', 'http://img1.lukou.com/static/coupon/p/image_link/QjzRd520nU8RciyPAVxIzar1LOWcvx0S.jpeg,http://img1.lukou.com/static/coupon/p/image_link/QjzRd520nU8RciyPAVxIzar1LOWcvx0S.jpeg,http://img1.lukou.com/static/coupon/p/image_link/kQLE6VhmCBY85AyukV6Bd3wKyQ4EC1LH');

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `id` int(50) NOT NULL AUTO_INCREMENT,
  `c_id` int(50) NOT NULL COMMENT '商品类别编号',
  `c_name` varchar(50) DEFAULT '' COMMENT '商品类别名称',
  `createtime` date DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`,`c_id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of category
-- ----------------------------
INSERT INTO `category` VALUES ('1', '1', '男装', '2020-03-17');
INSERT INTO `category` VALUES ('2', '2', '女装', '2020-03-05');
INSERT INTO `category` VALUES ('3', '3', '美妆/个护', '2020-03-15');
INSERT INTO `category` VALUES ('4', '4', '推荐', '2020-03-21');
INSERT INTO `category` VALUES ('26', '5', '手机数码', '2020-03-17');
INSERT INTO `category` VALUES ('27', '6', '零食王国', '2020-03-30');

-- ----------------------------
-- Table structure for goodsbuy
-- ----------------------------
DROP TABLE IF EXISTS `goodsbuy`;
CREATE TABLE `goodsbuy` (
  `gb_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `buy_type` varchar(50) CHARACTER SET utf32 DEFAULT NULL COMMENT '状态（buy_now立即购买 , cart 购物车）',
  `g_id` int(11) DEFAULT NULL COMMENT '商品编号',
  `user_phone` bigint(11) NOT NULL COMMENT '当前用户',
  `select_attr` varchar(255) DEFAULT NULL COMMENT '已选的规格',
  `num` int(11) DEFAULT NULL COMMENT '选择的数量',
  `single_total` float(10,2) DEFAULT NULL COMMENT '单个商品总价（单价*数量）',
  `single_price` float(10,2) DEFAULT NULL COMMENT '单价',
  PRIMARY KEY (`gb_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of goodsbuy
-- ----------------------------
INSERT INTO `goodsbuy` VALUES ('1', 'cart', '1003', '0', '[\"红\",\"纯棉\"]', '2', null, '555.00');
INSERT INTO `goodsbuy` VALUES ('2', 'cart', '1006', '0', '[\"紫\",\"32G\"]', '2', '444.00', '222.00');
INSERT INTO `goodsbuy` VALUES ('3', 'buy_now', '1004', '13000000000', '[\"雅白\",\"l\"]', '2', '22.00', '11.00');
INSERT INTO `goodsbuy` VALUES ('6', 'buy_now', '1008', '13078030746', '[\"12寸\",\"黑\"]', '2', '53.80', '26.90');

-- ----------------------------
-- Table structure for goodsm
-- ----------------------------
DROP TABLE IF EXISTS `goodsm`;
CREATE TABLE `goodsm` (
  `id` int(50) NOT NULL AUTO_INCREMENT COMMENT '编号随意',
  `g_id` bigint(50) NOT NULL COMMENT '商品编号',
  `g_name` varchar(50) DEFAULT NULL COMMENT '商品名称',
  `g_imgurl` varchar(100) DEFAULT '' COMMENT '商品大图片路径',
  `g_imglist` varchar(255) DEFAULT NULL COMMENT '轮播图列表',
  `g_unit` varchar(100) DEFAULT NULL COMMENT '商品单位',
  `c_name` varchar(20) DEFAULT NULL COMMENT '商品类目',
  `g_price` varchar(50) DEFAULT NULL COMMENT '价格',
  `g_stock` int(100) DEFAULT NULL COMMENT '库存',
  `g_attr` varchar(255) DEFAULT NULL COMMENT '商品规格',
  `g_datetime` date DEFAULT NULL COMMENT '日期',
  `g_note` varchar(100) DEFAULT '' COMMENT '备注(没用)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of goodsm
-- ----------------------------
INSERT INTO `goodsm` VALUES ('26', '1004', '百搭过膝外套女装早春季2020新款韩版立领红色流行气质中连衣裙', 'http://localhost:2020/uploads/5c698eb9f19a965bab5ef4d816a50cb3.jpg', 'http://localhost:2020/uploads/afd496a747983093dca660aee9682d26.jpg,http://localhost:2020/uploads/db3b341774eeffa68c931466e55b6f02.jpg', '打', '男装', '11.00', '47', '[{\"颜色\":\"雅白 素黑\"},{\"尺寸\":\"s m l\"}]', '2020-03-16', '');
INSERT INTO `goodsm` VALUES ('28', '1006', '七娃子', 'http://localhost:2020/uploads/ec86a33bf1a8372e1ef676e9fbe593c1.jpg', 'http://localhost:2020/uploads/93a2c48e6352431eabec32ae7881721d.jpg,http://localhost:2020/uploads/5633a3f036eb065db6fe29e9753326d0.jpg', '件', '零食王国', '222', '90', '[{\"颜色\":\"红 紫 蓝\"},{\"容量\":\"16G 32G\"}]', '2020-04-08', '放驿站');
INSERT INTO `goodsm` VALUES ('30', '1001', '2020新韩版大码女装夏季短袖t恤胖mm宽松百搭白色半袖ins上衣服潮             ', 'http://localhost:2020/uploads/061419f6bf3e7fd354473151c6d421e4.jpg', 'http://localhost:2020/uploads/321ac5fb4db3ca34c7d483d6d68d0187.jpg,http://localhost:2020/uploads/4da8a6ebb35deec6882cdce377ecbba2.jpg,http://localhost:2020/uploads/0af29bf5fca452bbc494045475ec7ad1.jpg', '件', '女装', '79', '4511', '[{\"颜色\":\"绿 黑 红\"},{\"尺寸\":\"S M L XL\"}]', '0000-00-00', '');
INSERT INTO `goodsm` VALUES ('31', '1002', '完美日记天鹅绒丝绒唇釉女V08雾面哑光持久平价学生V01', 'http://localhost:2020/uploads/f2072afe258b97e58ffe9a6e73f259d2.jpg', 'http://localhost:2020/uploads/c3453ed7e2b330a783b1c2d4d6f7e53d.jpg,http://localhost:2020/uploads/530f232b6503a8ec92c7e19f233577df.jpg', '套', '美妆/个护', '199.99', '6546', '[{\"颜色\":\"红 紫 蓝\"},{\"朵数\":\"99 199 999\"}]', '0000-00-00', '');
INSERT INTO `goodsm` VALUES ('39', '1003', '卫衣2020新款女春秋装韩版宽松薄款方领学生百搭牛油果长袖连衣裙潮', 'http://localhost:2020/uploads/167209544284330acc9096fca9ad5c2c.jpg', 'http://localhost:2020/uploads/404ff9992fee652232f1941859a91e53.jpg,http://localhost:2020/uploads/66386d41cf404143c258d974caa5cd95.jpg', '件', '女装', '555', '3322', '[{\"颜色\":\"红 紫\"},{\"布料\":\"涤纶 纯棉\"}]', '0000-00-00', '');
INSERT INTO `goodsm` VALUES ('40', '1005', '耳机入耳式vivo原装正品华为手机重低音通用苹果6plus有线K歌oppor11原配x9女生半耳塞安', 'http://localhost:2020/uploads/3fe993fcc78d8592f0343011c982d69a.jpg', 'http://localhost:2020/uploads/54d4c50e58fe07b3dc185e45e5f33fc8.jpg,http://localhost:2020/uploads/4fd0ac07e09dbcbacc95914b8c88c510.jpg,http://localhost:2020/uploads/12fbcdb75b6dd3556c82fbdf2af99a71.jpg,http://localhost:2020/uploads/7d5d74f9af8649d5acc300f1', '副', '手机数码', '8.8', '892', '[{\"音色\":\"低音 重低音 浑厚\"},{\"颜色\":\"幻黑 雅白\"}]', '0000-00-00', '');
INSERT INTO `goodsm` VALUES ('41', '1007', '【活动中】小金管遮瑕膏', 'http://localhost:2020/uploads/d994dba64c64b8f04e64c3f8a0e1c236.jpg', 'http://localhost:2020/uploads/d129d61f8d8fd33603286108453266fd.jpg,http://localhost:2020/uploads/2624108c883c797107106f5a870b7773.jpg,http://localhost:2020/uploads/8e2c3bf4e1b590cdffddddc3f49ba295.jpg', '支', '美妆/个护', '29', '785', '[{\"质地\":\"粉液 磨砂\"},{\"颜色\":\"紫（黄肤色） 绿（白肤色）\"}]', '0000-00-00', '');
INSERT INTO `goodsm` VALUES ('42', '1008', 'hh学生上课懒人运动挂脖风扇旅游户外 USB充电器迷你运动小风扇', 'http://localhost:2020/uploads/d8191e4bcbaec9dbe0e3d8e10103ec54.jpg', 'http://localhost:2020/uploads/1150600a070ad3531877c54ddfa3db9c.jpg', '台', '推荐', '26.9', '8751', '[{\"尺寸\":\"8寸 12寸\"},{\"颜色\":\"蓝 黑\"}]', '0000-00-00', '');
INSERT INTO `goodsm` VALUES ('43', '33444433', '女装大佬', 'http://localhost:2020/uploads/9d2fd51097ad916e75e6aa699e54a316.jpg', 'http://localhost:2020/uploads/d41431bccc38159bb6cbef52cc6494ba.jpg,http://localhost:2020/uploads/1572f3559088553cacd5fcc93d8c2e43.jpg', '支', '女装', '44', '5666', '[{\"颜色\":\"绿 蓝\"}]', '0000-00-00', '');

-- ----------------------------
-- Table structure for goodsorder
-- ----------------------------
DROP TABLE IF EXISTS `goodsorder`;
CREATE TABLE `goodsorder` (
  `o_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '订单ID（一种商品对应一个）',
  `gb_id` int(11) DEFAULT NULL COMMENT '此处可删',
  `order_id` varchar(50) DEFAULT NULL COMMENT '订单编号（前端给时间戳）',
  `addr_id` int(10) DEFAULT NULL COMMENT '收货地址ID',
  `status` int(10) NOT NULL DEFAULT '1' COMMENT '订单状态（-1全部，1待发货，2待收货，3待评价，4已完成）',
  `g_id` int(11) DEFAULT NULL COMMENT '商品编号',
  `user_phone` bigint(11) NOT NULL COMMENT '当前用户',
  `select_attr` varchar(255) DEFAULT NULL COMMENT '已选的规格',
  `num` int(10) DEFAULT NULL COMMENT '选择的数量',
  `single_total` float(10,2) DEFAULT NULL COMMENT '单个商品总价（单价*数量）',
  `single_price` float(10,2) DEFAULT NULL COMMENT '单价',
  `total_price` float(10,2) DEFAULT NULL COMMENT '订单总价',
  `g_imgurl` varchar(255) DEFAULT NULL,
  `g_name` varchar(255) DEFAULT NULL COMMENT '商品描述',
  `g_note` varchar(255) DEFAULT NULL COMMENT '订单备注',
  `add_time` varchar(50) DEFAULT NULL COMMENT '下单日期（前端传）',
  `tacking_num` varchar(50) DEFAULT NULL COMMENT '快递单号',
  `tacking_company` varchar(50) DEFAULT NULL COMMENT '快递公司',
  PRIMARY KEY (`o_id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of goodsorder
-- ----------------------------
INSERT INTO `goodsorder` VALUES ('48', null, '1589951505483', '8', '3', '1003', '13000000000', '[\"红\",\"涤纶\"]', '1', '555.00', '555.00', '555.00', 'http://localhost:2020/uploads/167209544284330acc9096fca9ad5c2c.jpg', '卫衣2020新款女春秋装韩版宽松薄款方领学生百搭牛油果长袖连衣裙潮', '', '2020-05-20T05:11:45.483Z', '5555555', '德邦');
INSERT INTO `goodsorder` VALUES ('49', null, '1590155431773', '5', '1', '1006', '13078030746', '[\"红\",\"32G\"]', '2', '444.00', '222.00', '444.00', 'http://localhost:2020/uploads/ec86a33bf1a8372e1ef676e9fbe593c1.jpg', '七娃子', '', '2020-05-22T13:50:31.773Z', null, null);
INSERT INTO `goodsorder` VALUES ('51', null, '1590217724643', '2', '2', '1007', '13078030746', '[\"粉液\",\"绿（白肤色）\"]', '2', '58.00', '29.00', '58.00', 'http://localhost:2020/uploads/d994dba64c64b8f04e64c3f8a0e1c236.jpg', '【活动中】小金管遮瑕膏', '到请致电', '2020-05-23T07:08:44.643Z', '333333444', '中通');
INSERT INTO `goodsorder` VALUES ('52', null, '1590220212684', '3', '1', '1007', '13078030746', '[\"磨砂\",\"绿（白肤色）\"]', '2', '58.00', '29.00', '58.00', 'http://localhost:2020/uploads/d994dba64c64b8f04e64c3f8a0e1c236.jpg', '【活动中】小金管遮瑕膏', '放在天猫', '2020-05-23T07:50:12.684Z', null, null);

-- ----------------------------
-- Table structure for menulist
-- ----------------------------
DROP TABLE IF EXISTS `menulist`;
CREATE TABLE `menulist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `f_id` varchar(20) NOT NULL COMMENT '菜单编号',
  `name` varchar(50) DEFAULT '' COMMENT '菜单名称',
  `icon` varchar(50) DEFAULT '' COMMENT '菜单图标名称',
  `path` varchar(50) DEFAULT '' COMMENT '菜单路径',
  `p_id` varchar(50) DEFAULT NULL COMMENT '对应的一级菜单编号',
  `superadmin` tinyint(2) DEFAULT '1' COMMENT '超级管理员',
  `admin` tinyint(2) DEFAULT '1' COMMENT '管理员',
  `salesman` tinyint(2) DEFAULT '1' COMMENT '售货员',
  `vip` tinyint(2) DEFAULT '1' COMMENT '会员',
  `level` tinyint(2) DEFAULT '1' COMMENT '菜单等级',
  PRIMARY KEY (`id`),
  KEY `p_id` (`p_id`(20))
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of menulist
-- ----------------------------
INSERT INTO `menulist` VALUES ('1', '1', '个人信息管理', 'el-icon-user-solid', '', '', '1', '1', '1', '1', '0');
INSERT INTO `menulist` VALUES ('2', '1.1', '个人信息查询', 'el-icon-s-operation', 'myselfquery', '1', '1', '1', '1', '1', '1');
INSERT INTO `menulist` VALUES ('3', '1.2', '个人信息修改', 'el-icon-edit', 'myselfupdate', '1', '1', '1', '1', '1', '1');
INSERT INTO `menulist` VALUES ('4', '1.3', '修改密码', 'el-icon-edit-outline', 'passupdate', '1', '1', '1', '1', '1', '1');
INSERT INTO `menulist` VALUES ('5', '2', '管理员信息管理', 'el-icon-s-custom', '', null, '1', '0', '0', '0', '0');
INSERT INTO `menulist` VALUES ('6', '2.1', '管理员信息列表', 'el-icon-s-operation', 'adminlist', '2', '1', '0', '0', '0', '1');
INSERT INTO `menulist` VALUES ('7', '2.2', '添加管理员信息', 'el-icon-edit', 'addadmin', '2', '1', '0', '0', '0', '1');
INSERT INTO `menulist` VALUES ('20', '6.3', '商品类别信息列表', 'el-icon-tickets', 'categorylist', '6', '1', '1', '0', '0', '1');
INSERT INTO `menulist` VALUES ('30', '10', '订单管理', 'el-icon-goods', null, null, '1', '1', '1', '0', '0');
INSERT INTO `menulist` VALUES ('31', '10.1', '订单信息列表', 'el-icon-document-copy', 'orderlist', '10', '1', '1', '1', '0', '1');
INSERT INTO `menulist` VALUES ('32', '11', '商品管理', 'el-icon-s-help', '', null, '1', '1', '1', '0', '0');
INSERT INTO `menulist` VALUES ('33', '11.1', '商品分类列表', 'el-icon-star-on', 'shelveslist', '11', '1', '1', '1', '1', '1');
INSERT INTO `menulist` VALUES ('35', '11.3', '添加商品信息', 'el-icon-circle-plus', 'addonshelves', '11', '1', '1', '1', '0', '1');
INSERT INTO `menulist` VALUES ('45', '11.6', '商品信息列表', 'el-icon-edit', 'goodsM', '11', '1', '1', '1', '0', '1');
INSERT INTO `menulist` VALUES ('46', '3', '用户账号管理', 'el-icon-user-solid', '', null, '1', '1', '1', '1', '1');
INSERT INTO `menulist` VALUES ('47', '3.1', '账号信息查询', 'el-icon-edit', 'userinfquery', '3', '1', '1', '1', '1', '1');

-- ----------------------------
-- Table structure for shelves
-- ----------------------------
DROP TABLE IF EXISTS `shelves`;
CREATE TABLE `shelves` (
  `id` int(50) NOT NULL AUTO_INCREMENT,
  `shelvesid` bigint(50) NOT NULL COMMENT '货架号',
  `shelvesname` varchar(50) DEFAULT NULL COMMENT '货架类别',
  `createtime` date DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=271 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of shelves
-- ----------------------------
INSERT INTO `shelves` VALUES ('243', '3', '推荐', '2020-03-25');
INSERT INTO `shelves` VALUES ('246', '7', '女装', '2020-03-25');
INSERT INTO `shelves` VALUES ('265', '1', '手机数码', '2020-03-30');
INSERT INTO `shelves` VALUES ('266', '6', '零食王国', '2020-03-30');
INSERT INTO `shelves` VALUES ('267', '8', '美妆/个护', '2020-03-30');
INSERT INTO `shelves` VALUES ('269', '2', '男装', '2020-03-30');

-- ----------------------------
-- Table structure for staffusers
-- ----------------------------
DROP TABLE IF EXISTS `staffusers`;
CREATE TABLE `staffusers` (
  `id` int(50) NOT NULL AUTO_INCREMENT COMMENT '序号',
  `s_id` int(50) NOT NULL COMMENT '员工号',
  `username` varchar(50) DEFAULT NULL COMMENT '员工用户名',
  `name` varchar(50) DEFAULT NULL COMMENT '员工姓名',
  `password` varchar(50) DEFAULT NULL COMMENT '登录密码',
  `role` enum('超级管理员','管理员','售货员') DEFAULT NULL COMMENT '超市角色',
  `sex` enum('男','女') DEFAULT NULL COMMENT '员工性别',
  `age` int(50) DEFAULT NULL COMMENT '员工年龄',
  `xueli` enum('博士','硕士','本科','大专','高中','初中','小学') DEFAULT '本科' COMMENT '员工学历',
  `email` varchar(50) DEFAULT NULL COMMENT '员工邮箱',
  `phone` bigint(20) unsigned DEFAULT NULL COMMENT '员工手机号',
  `createtime` date DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of staffusers
-- ----------------------------
INSERT INTO `staffusers` VALUES ('1', '20200001', 'super', '熊大', '222222', '超级管理员', '女', '22', '高中', '11123@qq.com', '15456455471', '2020-03-03');
INSERT INTO `staffusers` VALUES ('2', '20203109', 'admin', '光头强', 'g00000', '管理员', '男', '11', '硕士', '10086@qq.com', '15412412400', '2020-03-12');

-- ----------------------------
-- Table structure for uniuserinf
-- ----------------------------
DROP TABLE IF EXISTS `uniuserinf`;
CREATE TABLE `uniuserinf` (
  `u_id` int(10) NOT NULL AUTO_INCREMENT,
  `nickname` varchar(30) NOT NULL DEFAULT '游客' COMMENT '昵称',
  `phone` bigint(11) NOT NULL,
  `password` varchar(20) NOT NULL COMMENT '登录密码',
  PRIMARY KEY (`u_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of uniuserinf
-- ----------------------------
INSERT INTO `uniuserinf` VALUES ('1', '木头人', '13078030746', 'z22222');
INSERT INTO `uniuserinf` VALUES ('3', '二狗子', '13000000000', 'o00000');
SET FOREIGN_KEY_CHECKS=1;
