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
          <!-- <template v-slot:buttons="{ item }">
            <v-btn
              small
              text
              color="primary"
              class="my-2"
              @click="dataStructureDetails(item)"
              >订阅系统信息详情</v-btn
            >
          </template> -->
          <template v-slot:buttons2="{ item, index }">
            <!-- <v-btn
              v-if="tab"
              small
              text
              color="primary"
              class="my-2"
              @click.stop="addFileds(item)"
              >修改</v-btn
            > -->
            <v-btn
              small
              v-if="tab"
              text
              color="primary"
              class="my-2"
              @click="
                HConfirmShow = true;
                HConfirmItem = item;
              "
              >删除</v-btn
            >
            <v-btn
              small
              text
              color="primary"
              class="my-2"
              @click="getVideoTopicDescription(item, index)"
              >查看描述</v-btn
            >
          </template>
        </h-table>
      </v-tab-item>
    </v-tabs-items>
    <h-dialog v-if="dialogFlag" v-model="dialogFlag">
      <!-- <data-structure-dialog
        slot="dialog-content"
        :rowObj="rowObj"
        v-if="dialogShow == 2"
      /> -->
      <create-video-topic-dialog slot="dialog-content" v-if="dialogShow === 1" />
      <topic-ancilary-information-dialog
        slot="dialog-content"
        :otherObj="otherObj"
        v-else-if="dialogShow === 3"
      />
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
// import DataStructureDialog from "./childComponent/dataStructureDialog.vue";
import CreateVideoTopicDialog from "./childComponent/createVideoTopicDialog.vue";
import { VideoTopicAdd } from "../../../type/video-add.type";
import topicAncilaryInformationDialog from "./childComponent/topicAncilaryInformationDialog.vue";
import util from "../../../decorator/utilsDecorator";
import alertUtil from "../../../utils/alertUtil";
import { rootStoreModule } from "../../../store/modules/root";

@Component({
  components: {
    HTable,
    HDialog,
    HConfirm,
    // DataStructureDialog,
    CreateVideoTopicDialog,
    topicAncilaryInformationDialog,
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
        },
      };
    },
  });

  private tab = null;
  private items = ["所有主题", "我的主题"];
  private dialogFlag: boolean = false; //弹窗展示
  private dialogShow: number = 0; //展示哪个弹窗 1.是添加和修改弹窗 3.是描述弹窗
  // private rowObj: object = {}; //子系统信息详情
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
      value: "cmdName",
    },
    {
      text: "所属用户",
      align: "center",
      value: "userName",
    },
    {
      text: "数据源地址",
      align: "center",
      value: "",
    },
    {
      text: "摄像头位置",
      align: "center",
      value: "",
    },
    {
      text: "数据存储目录",
      align: "center",
      slot: "",
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

  //查询通用调用方法
  private async searchMethod(bool: boolean, params: object, tab?: boolean) {
    if (tab) {
      const { data }: returnDataType = bool
        ? await this.h_request["httpGET"]<object>("GET_CMD_MYCMDBYID", params)
        : await this.h_request["httpGET"]<object>("GET_CMD_MYCMD", params);

      data.list &&
        (this.desserts = data.list.map((item: any) => {
          return { ...item, flag: false };
        }));

      this.paginationLength = Math.ceil(data["total"] / this.pageSize) || 1;
    } else {
      const { data }: returnDataType = bool
        ? await this.h_request["httpGET"]<object>("GET_CMD_SELECTCMD", params)
        : await this.h_request["httpGET"]<object>("GET_CMD_FIND_ALL", params);

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

  //数据结构展示方法
  // private dataStructure(item: any, str: string) {
  //   this.dialogFlag = true;
  //   this.dialogShow = 2;
  //   this.rowObj = item;
  //   this.formObj.title = str;
  //   this.formObj.btnName = [];
  //   this.formObj.methodName = " ";
  // }

  private ancillaryInformation(info: any, str: string) {
    this.dialogFlag = true;
    this.dialogShow = 3;
    this.otherObj = info;
    this.formObj.title = str;
    this.formObj.btnName = [];
    this.formObj.methodName = " ";
  }

  // private dataStructureDetails(item: any) {
  //   this.dataStructure(item, "子系统信息详情");
  // }
  // private addFileds(item: any) {
  //   this.createTopicVideo(item);
  // }

  private getVideoTopicDescription(item: any, index: number) {
    // 查看描述
    let info: any = {};
    if (!this.desserts[index].flag) {
      this.desserts[index].flag = true;
    }
    this.ancillaryInformation(this.desserts[index], "描述");
  }

  // 删除主题
  private async deleteVideoTopic() {
    if (this.HConfirmItem.id === undefined) {
      return;
    }
    const { success } = await this.h_request["httpGET"]("GET_CMD_DELETE", {
      id: this.HConfirmItem.id,
    });
    if (success) {
      this.HConfirmShow = false;
      this.h_utils["alertUtil"].open("主题删除成功", true, "success");
      this.searchMethod(
        false,
        {
          pageSize: this.pageSize,
          pageNum: 1,
        },
        true
      );
      this.pageNum=1
    }
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
