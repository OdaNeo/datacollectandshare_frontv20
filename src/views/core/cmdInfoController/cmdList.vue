<template>
  <div>
    <v-row>
      <v-col cols="3">
        <v-text-field
          solo
          dense
          placeholder="请输入查找的命令ID"
          clearable
          append-icon="mdi-magnify"
          @click:append="searchCmd"
          v-model="queryCmdID"
          v-only-num="{
            set: this,
            name: 'userID',
          }"
        >
        </v-text-field>
      </v-col>
      <v-col cols="2">
        <v-btn color="primary" dark @click.stop="createCommend(false)"
          >创建命令</v-btn
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
          <template v-slot:buttons="{ item }">
            <v-btn
              small
              text
              color="primary"
              class="my-2"
              @click="dataStructureDetails(item)"
              >订阅统信息详情</v-btn
            >
          </template>
          <template v-slot:buttons2="{ item, index }">
            <v-btn
              v-if="tab"
              small
              text
              color="primary"
              class="my-2"
              @click.stop="addFileds(item)"
              >修改</v-btn
            >
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
              @click="getCmdDescription(item, index)"
              >查看描述</v-btn
            >
          </template>
        </h-table>
      </v-tab-item>
    </v-tabs-items>
    <h-dialog v-if="dialogFlag" v-model="dialogFlag">
      <data-structure-dialog
        slot="dialog-content"
        :rowObj="rowObj"
        v-if="dialogShow == 2"
      />
      <create-cmd-dialog slot="dialog-content" v-else-if="dialogShow == 1" />
      <cmd-ancilary-information-dialog
        slot="dialog-content"
        :otherObj="otherObj"
        v-else-if="dialogShow == 3"
      />
    </h-dialog>
    <h-confirm
      v-if="HConfirmShow"
      @hcancel="HConfirmShow = false"
      @hconfirm="deleteCmd"
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
import DataStructureDialog from "./childComponent/dataStructureDialog.vue";
import CreateCmdDialog from "./childComponent/createCmdDialog.vue";
import { CmdAdd } from "../../../type/cmd-add.type";
import cmdAncilaryInformationDialog from "./childComponent/cmdAncilaryInformationDialog.vue";
import util from "../../../decorator/utilsDecorator";
import alertUtil from "../../../utils/alertUtil";
import { rootStoreModule } from "../../../store/modules/root";

@Component({
  components: {
    HTable,
    HDialog,
    HConfirm,
    DataStructureDialog,
    CreateCmdDialog,
    cmdAncilaryInformationDialog,
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
          id: "", // 命令ID
          canNotEdit: false, // 添加数据
          cmdName: "", // 命令名称
          userName: "", // 所属用户
          producer: "", // 源系统名称
          consumers: [] as Array<string>, // 订阅系统名
          description: "", //描述（描述）
        },
      };
    },
  });

  private tab = null;
  private items = ["所有命令", "我的命令"];
  private dialogFlag: boolean = false; //弹窗展示
  private dialogShow: number = 0; //展示哪个弹窗 1.是添加和修改弹窗 2.是详细信息弹窗 3.是描述弹窗
  private rowObj: object = {}; //子系统信息详情
  private otherObj: any = {}; //描述
  private onlyShowOther: boolean = false; // 只显示补充信息

  private systemName = rootStoreModule.UserState.userMessage.systemName;
  private producer: string = "";

  private HConfirmShow = false;
  private HConfirmItem = {
    id: "",
  };

  private desserts: Array<any> = []; //数据列表
  private queryCmdID = null; //查询命令ID input框内容
  private paginationLength: number = 0; //分页数
  private pageNum: number = 1; //第几页
  private pageSize: number = 20; //每页展示多少条数据
  private headers = [
    //表头内容 所有命令
    {
      text: "命令ID",
      align: "center",
      value: "id",
    },
    {
      text: "命令名称",
      align: "center",
      value: "cmdName",
    },
    {
      text: "所属用户",
      align: "center",
      value: "userName",
    },
    {
      text: "生产系统名",
      align: "center",
      value: "producer",
    },
    {
      text: "订阅系统信息",
      align: "center",
      slot: "buttons",
    },
    {
      text: "操作",
      align: "center",
      slot: "buttons2",
    },
  ];
  // 添加命令调用方法
  //  创建命令

  private createCommend(item: any) {
    this.dialogFlag = true;
    this.dialogShow = 1;
    this.formObj.btnName = ["立即提交"];
    this.formObj.title = "创建命令";
    this.formObj.methodName = "addCmd"; // 立即提交
    this.formObj.formObj = {
      id: "", // 命令ID
      canNotEdit: false, // 添加数据
      cmdName: "", // 命令名称
      userName: "", // 所属用户
      producer: this.producer, // 系统名称不可修改
      consumers: [] as Array<string>, // 订阅系统名
      description: "", //描述（描述）
    };

    // if 增加字段
    if (item) {
      this.formObj.title = "修改命令";
      this.formObj.formObj = {
        id: item.id, // 命令ID
        canNotEdit: true, // 添加数据
        cmdName: item.cmdName, // 命令名称
        userName: "", // 所属用户
        producer: item.producer, // 系统名称
        consumers: item.consumers.split(","), // 订阅系统名
        description: item.description, //描述（描述）
      };
    }
  }
  //  提交创建
  private addCmd(formObj: CmdAdd) {
    console.log(1);
    return new Promise(
      async (resolve, reject): Promise<void> => {
        let params: any = {};
        //  ADD 不提交id，UPDATE提交id
        formObj.canNotEdit && (params["id"] = formObj.id);
        params["cmdName"] = formObj.cmdName;
        params["consumers"] = formObj.consumers.join(",");
        params["producer"] = formObj.producer;
        params["description"] = formObj.description;

        const { success } = await this.h_request["httpPOST"](
          !formObj.canNotEdit ? "POST_CMD_ADD" : "POST_CMD_UPDATE",
          params
        );

        if (success) {
          this.h_utils["alertUtil"].open(
            !formObj.canNotEdit ? "命令创建成功" : "命令修改成功",
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

      this.paginationLength = Math.ceil(data["total"] / this.pageSize);
    } else {
      const { data }: returnDataType = bool
        ? await this.h_request["httpGET"]<object>("GET_CMD_SELECTCMD", params)
        : await this.h_request["httpGET"]<object>("GET_CMD_FIND_ALL", params);

      data.list &&
        (this.desserts = data.list.map((item: any) => {
          return { ...item, flag: false };
        }));

      this.paginationLength = Math.ceil(data["total"] / this.pageSize);
    }
  }

  //命令查询
  private searchCmd() {
    if (!this.queryCmdID) {
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
          id: this.queryCmdID,
        },
        !!this.tab
      );
    }
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
  }

  //数据结构展示方法
  private dataStructure(item: any, str: string) {
    this.dialogFlag = true;
    this.dialogShow = 2;
    this.rowObj = item;
    this.formObj.title = str;
    this.formObj.btnName = [];
    this.formObj.methodName = " ";
  }

  private ancillaryInformation(info: any, str: string) {
    this.dialogFlag = true;
    this.dialogShow = 3;
    this.otherObj = info;
    this.formObj.title = str;
    this.formObj.btnName = [];
    this.formObj.methodName = " ";
  }

  private dataStructureDetails(item: any) {
    this.dataStructure(item, "子系统信息详情");
  }

  private addFileds(item: any) {
    this.createCommend(item);
  }

  private async getCmdDescription(item: any, index: number) {
    // 查看描述
    let info: any = {};
    if (!this.desserts[index].flag) {
      this.desserts[index].flag = true;
    }
    this.ancillaryInformation(this.desserts[index], "描述");
  }
  private async deleteCmd() {
    if (this.HConfirmItem.id === undefined) {
      return;
    }
    const { success } = await this.h_request["httpGET"]("GET_CMD_DELETE", {
      id: this.HConfirmItem.id,
    });
    if (success) {
      this.HConfirmShow = false;
      this.h_utils["alertUtil"].open("命令删除成功", true, "success");
      this.searchMethod(
        false,
        {
          pageSize: this.pageSize,
          pageNum: 1,
        },
        true
      );
    }
  }
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
  private async getProducerList() {
    let data: Array<{ id: string; name: string }>;

    if (sessionStorage.systemInfo) {
      data = JSON.parse(sessionStorage.systemInfo);
    } else {
      const res = await this.h_request["httpGET"](
        "GET_USER_ADDUSER_GET_SYSTEM_INFO_ADD_ADDUSER",
        {}
      );
      data = res.data;
      sessionStorage.systemInfo = JSON.stringify(data);
    }

    for (let i = 0; i < data.length; i++) {
      if (data[i].id === this.systemName) {
        this.producer = data[i].name;
        return;
      }
    }
  }

  created() {
    this.getProducerList();
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
