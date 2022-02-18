// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    wifi_ssid: '',
    wifi_pass: '',
    wifi_riss: '',
    ip:'',
    port:'',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },

  onLoad() {
    // this.setData({
    //   port:8848
    // })
    wx.startWifi({
      success(res) {
        console.log(res.errMsg, 'wifi初始化成功');
      },
      fail: function(res){
        console.log(res.errMsg, 'wifi初始化失败');
      }
    });
    wx.getConnectedWifi({
      success: (e) => {
        console.log(e.wifi, 'wifi获取成功');
        this.setData({
          wifi_ssid:e.wifi.SSID
        })
      },
      fail: (e) => {
        console.log(e, 'wifi获取失败');
      }
    })
  },

  input_wifi_ssid_callback(e) {
    this.setData({
      wifi_ssid:e.detail.value
    })
    console.log(this.data.wifi_ssid);
  },

  input_wifi_pass_callback(e) {
    this.setData({
      wifi_pass:e.detail.value
    })
    console.log(this.data.wifi_pass);
  },

  input_ip_callback(e) {
    this.setData({
      ip:e.detail.value
    })
    console.log(this.data.ip);
  },

  input_port_callback(e) {
    this.setData({
      port:e.detail.value
    })
    console.log(this.data.port);
  },

  button_config_callback(e) {
    var ok_flag = false;
    console.log("wifi_ssid:",this.data.wifi_ssid);
    console.log("wifi_pass:",this.data.wifi_pass);
    console.log("ip address:",this.data.ip);
    console.log("port:",this.data.port);

    /* 检查是否为空 */
    if ((this.data.wifi_ssid == "") || (this.data.wifi_pass == "") || (this.data.ip == "") || (this.data.port == "")) {
      console.error("信息为空！！！");
      wx.showToast({
        title: '信息错误',
        icon:'error',
        duration:2500,
        mask:'true'
      })
      return;
    }

    /* 检查wifi */
    wx.startWifi({
      success(res) {
        console.log(res.errMsg, 'wifi初始化成功');
      },
      fail: function(res){
        console.log(res.errMsg, 'wifi初始化失败');
        return;
      }
    });
    wx.getConnectedWifi({
      success: (e) => {
        console.log(e.wifi, 'wifi获取成功');
        if (e.wifi.SSID != "PCMonitor") {
          wx.showToast({
            title: '请连接正确wifi',
            icon:'error',
            duration:2500,
            mask:'true'
          })
          return;
        }
        else {
          this.network_config();
          wx.showToast({
            title: '正在发送...',
            icon:'success',
            duration:5000,
            mask:'true'
          })
        }
      },
      fail: (e) => {
        console.log(e, 'wifi获取失败');
        return;
      }
    })
  },


  network_config (e) {

    var buffer = {
      'wifi_ssid' : this.data.wifi_ssid,
      'wifi_pass' : this.data.wifi_pass,
      'ip_address' : this.data.ip,
      'port' : this.data.port
    }
    var str = JSON.stringify(buffer)

    const udp = wx.createUDPSocket()
    udp.bind()
    udp.send({
      address: '255.255.255.255',
      port: 8848,
      message: str
    })
  },

  tcp_onconnect_callback(e) {
    console.log('tco connect success!!!')

  },

  bt_wifi_info_callback(e) {
    wx.startWifi({
      success(res) {
        console.log(res.errMsg, 'wifi初始化成功')
      },
      fail: function(res){
        console.log(res.errMsg, 'wifi初始化失败')
      }
    });
    wx.getConnectedWifi({
      success: (e) => {
        console.log(e.wifi, 'wifi获取成功')
        this.setData({
           wifi_ssid: e.wifi.SSID,
           wifi_pass: e.wifi.BSSID,
           wifi_riss: e.wifi.signalStrength
        })
      },
      fail: (e) => {
        console.log(e, 'wifi获取失败')
      }
    })    
  }
})
