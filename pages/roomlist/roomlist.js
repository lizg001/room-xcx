var WebIM = require("../../utils/WebIM")["default"];
let disp = require("../../utils/broadcast");

let result = {};
Page({
  data: {
    search_btn: true,
    search_friend: false,
    show_mask: false,
    groupList: [],		// 聊天室列表
    myName: ""
  },

  onLoad: function (option) {
    let me = this;
    disp.on("em.xmpp.invite.joingroup", function () {
      var pageStack = getCurrentPages();
      // 判断是否当前路由是本页
      if (pageStack[pageStack.length - 1].route === me.route) {
        // me.listGroups();
        me.listChatrooms();
      }
    });
    this.setData({
      myName: option.myName
    });
  },

  onShow: function () {
    // this.listGroups();
    this.listChatrooms();
  },

  //列出所有聊天室
  listChatrooms() {
    var me = this;
    var option = {
      apiUrl: 'https://a1.easemob.com',
      pagenum: 1,                                 // 页数
      pagesize: 20,                               // 每页个数
      success: function (rooms) {
        console.log(JSON.stringify(rooms) + "******");
        me.setData({
          groupList: rooms.data.data
        });

        getApp().globalData.groupList = rooms || [];
      },
      error: function () {
        console.log('List chat room error');
      }
    };
    WebIM.conn.getChatRooms(option);
  },

  // 列出所有群组 (调用 listRooms 函数获取当前登录用户加入的群组列表)
  // listGroups() {
  //   var me = this;
  //   WebIM.conn.listRooms({
  //     success: function (rooms) {
  //       me.setData({
  //         groupList: rooms
  //       });
  //       // 好像也没有别的官方通道共享数据啊
  //       getApp().globalData.groupList = rooms || [];
  //     },
  //     error: function () {

  //     }
  //   });
  // },


  openSearch: function () {
    this.setData({
      search_btn: false,
      search_friend: true,
      show_mask: true
    });
  },

  cancel: function () {
    this.setData({
      search_btn: true,
      search_friend: false,
      show_mask: false
    });
  },

  close_mask: function () {
    this.setData({
      search_btn: true,
      search_friend: false,
      show_mask: false
    });
  },

  into_room: function (event) {
    var nameList = {
      myName: this.data.myName,
      your: event.currentTarget.dataset.username,
      groupId: event.currentTarget.dataset.roomid
    };
    WebIM.conn.joinChatRoom({
      roomId: nameList.groupId, // 聊天室id
    });

    wx.navigateTo({
      url: '../chatroom/chatroom?username=' + JSON.stringify(nameList)
    });
  },

  build_group: function () {
    event.currentTarget.dataset.roomid = this.data.groupList.id
    var me = this;
    var nameList = {
      myName: me.data.myName
    };
    wx.navigateTo({
      url: "../add_groups/add_groups?owner=" + JSON.stringify(nameList)
    });
  },

  edit_group: function (event) {
    event.currentTarget.dataset.roomid = this.data.groupList.id
    var nameList = {
      myName: this.data.myName,
      groupName: event.currentTarget.dataset.username,
      roomId: event.currentTarget.dataset.roomid
    };
    wx.navigateTo({
      url: "../groupSetting/groupSetting?groupInfo=" + JSON.stringify(nameList)
    });
  }
});
