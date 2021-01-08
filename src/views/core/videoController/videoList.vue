<template>
  <div>
    <v-row>
      <v-col cols="3">
        <v-text-field
          solo
          dense
          placeholder="请输入查找的主题ID"
          clearable
          append-icon="mdi-magnify"
          @click:append="searchVideoTopic"
          v-model="queryVideoTopicID"
          v-only-num="{
            set: this,
            name: 'userID',
          }"
        >
        </v-text-field>
      </v-col>
      <v-col cols="2">
        <v-btn color="primary" dark @click.stop="createTopicVideo()"
          >创建主题</v-btn
        >
      </v-col>
    </v-row>
    <v-tabs v-model="tab" @change="tabChange">
      <v-tab v-for="item in items" :key="item">{{ item }}</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="item in items" :key="item">
        <h-table
          :headers="headers"
          :desserts="desserts"
          :height="500"
          :pageNum="pageNum"
          @PaginationsNow="PaginationsNow"
          :paginationLength="paginationLength"
        >
         <template v-slot:dataSourceList="{ item }">
            <v-btn
              small
              text
              color="primary"
              class="my-2"
              @click.stop="showVideoPopup(item.dataSourceList)"
              >{{item.dataSourceList}}</v-btn
            >
          </template>
          <template v-slot:buttons2="{ item }">
            <v-btn
              small
              v-if="tab"
              text
              color="primary"
              class="my-2"
              @click="HConfirmShow = true;HConfirmItem = item;"
            >删除
            </v-btn>
          </template>
        </h-table>
      </v-tab-item>
    </v-tabs-items>
    <h-dialog v-if="dialogFlag" v-model="dialogFlag">
      <create-video-topic-dialog slot="dialog-content" v-if="dialogShow === 1" />
      <video-popup slot="dialog-content" v-if="dialogShow === 2" />
    </h-dialog>
    <h-confirm
      v-if="HConfirmShow"
      @hcancel="HConfirmShow = false"
      @hconfirm="deleteVideoTopic"
    />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Provide } from "vue-property-decorator";
import { paramsType, returnDataType } from "../../../type/http-request.type";
import http from "../../../decorator/httpDecorator";
import HTable from "../../../components/h-table.vue";
import HConfirm from "../../../components/h-confirm.vue";
import HDialog from "../../../components/h-dialog.vue";
import CreateVideoTopicDialog from "./childComponent/createVideoTopicDialog.vue";
import VideoPopup from "./childComponent/videoPopup.vue"
import { VideoTopicAdd } from "../../../type/video-add.type";
import util from "../../../decorator/utilsDecorator";
import alertUtil from "../../../utils/alertUtil";
import { rootStoreModule } from "../../../store/modules/root";

@Component({
  components: {
    HTable,
    HDialog,
    HConfirm,
    CreateVideoTopicDialog,
    VideoPopup
  },
})
@http
@util
export default class CmdList extends Vue {
  @Provide("formProvide") private formObj = new Vue({
    data() {
      return {
        title: "",
        btnName: [] as string[],
        methodName: "",
        formObj: {
          videoTopicName:'',// 视频主题名
          dataSource:'',// 数据源地址
          cameraPosition:'', //摄像头位置
        },
      };
    },
  });

  private tab = null;
  private items = ["所有主题", "我的主题"];
  private dialogFlag: boolean = false; //弹窗展示
  private dialogShow: number = 0; //展示哪个弹窗 1.创建主题 2.视频弹窗
  private otherObj: any = {}; //描述

  private HConfirmShow = false;
  private HConfirmItem = {
    id: "",
  };

  private desserts: Array<any> = []; //数据列表
  private queryVideoTopicID = null; //查询主题ID input框内容
  private paginationLength: number = 0; //分页数
  private pageNum: number = 1; //第几页
  private pageSize: number = 20; //每页展示多少条数据
  private headers = [
    //表头内容 所有主题
    {
      text: "主题ID",
      align: "center",
      value: "id",
    },
    {
      text: "主题名称",
      align: "center",
      value: "topicName",
    },
    {
      text: "所属用户",
      align: "center",
      value: "userName",
    },
    {
      text: "数据源地址",
      align: "center",
      value: "dataSource",
    },
    {
      text: "摄像头位置",
      align: "center",
      value: "cameraPosition",
    },
    {
      text: "数据存储目录",
      align: "center",
      slot: "dataSourceList",
    },
    {
      text: "操作",
      align: "center",
      slot: "buttons2",
    },
  ];
  // 添加主题调用方法
  //  创建主题
  private createTopicVideo() {
    this.dialogFlag = true;
    this.dialogShow = 1;
    this.formObj.btnName = ["立即提交"];
    this.formObj.title = "创建主题";
    this.formObj.methodName = "addVideoTopic"; // 立即提交
    this.formObj.formObj = {
        videoTopicName:'',// 视频主题名
        dataSource:'',// 数据源地址
        cameraPosition:'' // 摄像头位置
    };
  }

  //  提交创建
  private addVideoTopic(formObj: VideoTopicAdd) {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        let params: any = {};
        //  ADD 不提交id，UPDATE提交id
        // formObj.canNotEdit && (params["id"] = formObj.id);
        // params["cmdName"] = formObj.cmdName;
        // params["consumers"] = formObj.consumers.join(",");
        // params["producer"] = formObj.producer;
        // params["description"] = formObj.description;

        const { success } = await this.h_request["httpPOST"](
          !formObj.canNotEdit ? "POST_CMD_ADD" : "POST_CMD_UPDATE",
          params
        );

        if (success) {
          this.h_utils["alertUtil"].open(
            !formObj.canNotEdit ? "主题创建成功" : "主题修改成功",
            true,
            "success"
          );

          this.searchMethod(
            false,
            {
              pageSize: this.pageSize,
              pageNum: 1,
            },
            this.tab ? true : false
          );
          this.pageNum=1
        }
        resolve(success);
      }
    );
  }
  // 视频弹窗
  private showVideoPopup(list:string){
    this.dialogFlag = true;
    this.dialogShow = 2;
    this.formObj.title = "视频";
    this.formObj.btnName = [];
    this.formObj.methodName = ""; 
  }

  //查询通用调用方法
  private async searchMethod(bool: boolean, params: object, tab?: boolean) {
    const data=
        {
          list:
          [{
            id: 123123,
            topicName:1231,
            userName: "user2",
            dataSource: "ATS",
            cameraPosition: "Position1",
            dataSourceList: "dataSourceList"
          }],
          total:1
        }
    if (tab) {
      // const { data }: returnDataType = bool
      //   ? await this.h_request["httpGET"]<object>("GET_CMD_MYCMDBYID", params)
      //   : await this.h_request["httpGET"]<object>("GET_CMD_MYCMD", params);
      data.list &&
        (this.desserts = data.list.map((item: any) => {
          return { ...item, flag: false };
        }));

      this.paginationLength = Math.ceil(data["total"] / this.pageSize) || 1;
    } else {
      // const { data }: returnDataType = bool
      //   ? await this.h_request["httpGET"]<object>("GET_CMD_SELECTCMD", params)
      //   : await this.h_request["httpGET"]<object>("GET_CMD_FIND_ALL", params);

      data.list &&
        (this.desserts = data.list.map((item: any) => {
          return { ...item, flag: false };
        }));

      this.paginationLength = Math.ceil(data["total"] / this.pageSize) || 1;
    }
  }

  //主题查询
  private searchVideoTopic() {
    if (!this.queryVideoTopicID) {
      this.searchMethod(
        false,
        {
          pageNum: 1,
          pageSize: this.pageSize,
        },
        !!this.tab
      );
    } else {
      this.searchMethod(
        true,
        {
          id: this.queryVideoTopicID,
        },
        !!this.tab
      );
    }
    this.pageNum=1
  }

  //tab切换方法
  private tabChange(tab: number) {
    this.searchMethod(
      false,
      {
        pageNum: 1,
        pageSize: this.pageSize,
      },
      !!tab
    );
    this.pageNum=1
  }

  // 删除主题
  private async deleteVideoTopic() {
    if (this.HConfirmItem.id === undefined) {
      return;
    }
    // const { success } = await this.h_request["httpGET"]("GET_CMD_DELETE", {
    //   id: this.HConfirmItem.id,
    // });
    // if (success) {
    //   this.HConfirmShow = false;
    //   this.h_utils["alertUtil"].open("主题删除成功", true, "success");
    //   this.searchMethod(
    //     false,
    //     {
    //       pageSize: this.pageSize,
    //       pageNum: 1,
    //     },
    //     true
    //   );
    //   this.pageNum=1
    // }
  }
  
  // 分页
  private PaginationsNow(page: number) {
    this.pageNum = page;
    this.searchMethod(
      false,
      {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
      },
      !!this.tab
    );
  }
}
</script>
<style scoped>
.table-leave-to {
  opacity: 0;
  transform: translate3d(800px, 0, 0);
}
.table-enter {
  opacity: 0;
  transform: translate3d(800px, 0, 0);
}
.table-leave-active {
  transition: 0.5s all ease;
}
.table-enter-active {
  transition: 0.5s all ease;
}
</style>
