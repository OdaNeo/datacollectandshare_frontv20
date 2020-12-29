<template>
  <div id="topicList">
    <v-row>
      <v-col cols="3">
        <v-text-field
          solo
          dense
          placeholder="请输入查找的主题ID"
          clearable
          append-icon="mdi-magnify"
          @click:append="searchTopic"
          v-model="queryTopicID"
          v-only-num="{
            set: this,
            name: 'userID',
          }"
        >
        </v-text-field>
      </v-col>
      <v-col cols="1">
        <v-btn color="primary" dark @click.stop="createTopic(false)">
          创建主题
        </v-btn>
      </v-col>
      <v-col cols="1">
        <v-btn color="primary" dark @click="openUpload($event)"
          >通过文件创建</v-btn
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
              v-if="item.topicInterFaceType !== 6"
              small
              text
              color="primary"
              class="my-2"
              @click="dataStructureDetails(item)"
            >
              数据结构详情
            </v-btn>
          </template>
          <template v-slot:buttons2="{ item, index }">
            <v-btn
              v-if="
                tab &&
                (item.topicInterFaceType === 1 ||
                  item.topicInterFaceType === 2 ||
                  item.topicInterFaceType === 3)
              "
              small
              text
              color="primary"
              class="my-2"
              @click.stop="addFileds(item)"
            >
              增加字段
            </v-btn>
            <v-btn
              small
              v-if="tab"
              text
              color="primary"
              class="my-2"
              @click.stop="
                HConfirmShow = true;
                HConfirmItem = item;
              "
            >
              删除
            </v-btn>
            <v-btn
              small
              v-if="tab && item.topicInterFaceType === 6"
              text
              color="primary"
              class="my-2"
              @click.stop="downloadFile(item)"
            >
              下载
            </v-btn>
            <v-btn
              small
              text
              color="primary"
              class="my-2"
              @click="getTopicInformation(item, index)"
            >
              查看附加信息
            </v-btn>
          </template>
        </h-table>
      </v-tab-item>
    </v-tabs-items>

    <h-dialog v-if="dialogFlag" v-model="dialogFlag" ref="HDialog">
      <data-structure-dialog
        slot="dialog-content"
        :rowObj="rowObj"
        v-if="dialogShow == 2"
      ></data-structure-dialog>
      <create-topic-dialog
        slot="dialog-content"
        v-else-if="dialogShow == 1"
        ref="createTopicDialog"
        @create-protobuf-file="createProtobufFile"
      ></create-topic-dialog>
      <topic-ancilary-information-dialog
        slot="dialog-content"
        :otherObj="otherObj"
        v-else-if="dialogShow == 3"
      ></topic-ancilary-information-dialog>
    </h-dialog>
    <!-- 上传文件对话框 -->
    <v-dialog
      v-model="upLoadFlag"
      max-width="750px"
      persistent
      content-class="upLoadDialog"
    >
      <v-card>
        <v-card-title class="dialog-title">上传文件</v-card-title>
        <v-card-text
          >支持.xls,
          .xlsx格式的单文件上传。文件名将自动填充主题名称。</v-card-text
        >
        <v-file-input
          accept=".xls,.xlsx"
          label="File input"
          @change="upLoadFile"
          @click:clear="canUpLoad = false"
          style="width: 730px"
          :key="forceRenderFlag"
        />
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="mr-4"
            solo
            :disabled="!canUpLoad"
            @click="upLoadFileConfirm"
            >确定上传</v-btn
          >
          <v-btn class="mr-4" solo @click="upLoadFileCancel">取消上传</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <h-confirm
      v-if="HConfirmShow"
      @hcancel="HConfirmShow = false"
      @hconfirm="deleteTopic"
    />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Provide } from "vue-property-decorator";
import { paramsType, returnDataType } from "../../../type/http-request.type";
import http from "../../../decorator/httpDecorator";
import { topicTable } from "../../../type/topic.type";
import HTable from "../../../components/h-table.vue";
import HConfirm from "../../../components/h-confirm.vue";
import Enum from "../../../decorator/enumDecorator";
import { queneType } from "../../../enum/topic-list-enum";
import HDialog from "../../../components/h-dialog.vue";
import DataStructureDialog from "./childComponent/dataStructureDialog.vue";
import CreateTopicDialog from "./childComponent/createTopicDialog.vue";
import { TopicAdd } from "../../../type/topic-add.type";
import { SystemConfigFormObj } from "../../../type/system-config.type";
import { GET_TOPICS_INFORMATION } from "../../../api/requestName";
import TopicAncilaryInformationDialog from "./childComponent/topicAncilaryInformationDialog.vue";
import util from "../../../decorator/utilsDecorator";
import { MomentInputObject } from "moment";
import alertUtil from "../../../utils/alertUtil";

import axios from "axios";
import { rootStoreModule } from "../../../store/modules/root";

import { saveAs } from "file-saver";
import XLSX from "xlsx";

@Component({
  components: {
    HTable,
    HDialog,
    HConfirm,
    DataStructureDialog,
    CreateTopicDialog,
    TopicAncilaryInformationDialog,
  },
})
@http
@Enum([
  {
    tsFileName: "topic-list-enum",
    enumName: "queneType",
  },
])
@util
export default class TopicList extends Vue {
  @Provide("formProvide") private formObj = new Vue({
    data() {
      return {
        title: "",
        btnName: [] as string[],
        methodName: "",
        formObj: {
          id: "", // 主题ID
          canNotEdit: false, // 添加数据
          interfaceType: 1,
          topicName: "", // 主题名称
          messageType: 0, // 消息类型
          dataBaseIp: "", // 数据库地址
          databaseType: "", // 数据库类型
          dataStructSchema: "", //
          writeElasticsearch: 1, // 是否展示
          redisTimer: "", // 内存过期时间
          port: "", // ?拉取ftp 端口号
          host: "", // ?拉取ftp
          baseUrl: "", // ?拉取ftp 地址
          userName: "", // ?拉取ftp 用户名
          password: "", // ?拉取ftp 密码
          header: [{ key: "", value: "" }],
          url: "",
          topicList: [
            {
              ["" as string]: "" as any,
              ["" as string]: "" as any,
              ["" as string]: "" as any, // 描述
              disabled: false,
            },
          ],
          AuthorizationObj: {
            key: "",
            value: "",
          },
          type: "", // 请求类型
          body: "", // body 数据结构
        },
      };
    },
  });

  private tab = null;
  private items = ["所有主题", "我的主题"];
  private dialogFlag: boolean = false; //弹窗展示
  private dialogShow: number = 0; //展示哪个弹窗 1.是主题添加和修改弹窗 2.是详细信息弹窗 3.是附加信息弹窗
  private rowObj: object = {}; //数据结构弹窗数据
  private otherObj: any = {}; //数据结构弹窗数据 补充
  private onlyShowOther: boolean = false; // 只显示补充信息

  private upLoadFlag: boolean = false;
  private canUpLoad: boolean = false;
  private SheetNames: string[] = [""];
  private Sheets: any;
  private forceRenderFlag: number = Math.random();
  private fileName: string = "";
  private sheetObj: any;
  private sheetCurIndex: number = 1;

  private HConfirmShow = false;
  private HConfirmItem = {
    id: "",
    topicName: "",
    topicInterFaceType: 0,
  };
  private file: File | null = null;
  private forms = new FormData();

  private desserts: Array<topicTable> = []; //数据列表
  private queryTopicID = null; //查询主题ID input框内容
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
      text: "订阅用户",
      align: "center",
      value: "userSubNameList",
      format: (userSubNameList: Array<string>) => {
        return userSubNameList.toString();
      },
    },
    {
      text: "接口类型",
      align: "center",
      value: "topicInterFaceType",
      format: (val: number) => {
        switch (val) {
          case 1:
            return "通用Rest接口";
          case 2:
            return "数据库采集";
          case 3:
            return "服务主动拉取";
          case 4:
            return "多级嵌套免校验";
          case 5:
            return "拉取FTP";
          case 6:
            return "PROTOBUF";
        }
      },
    },
    {
      text: "消息类型",
      align: "center",
      value: "queneType",
      format: (quene: number) => {
        return this.h_enum["queneType"][quene];
      },
    },
    {
      text: "数据结构",
      align: "center",
      slot: "buttons",
    },
    {
      text: "操作",
      align: "center",
      slot: "buttons2",
    },
  ];
  // 添加主题调用方法
  //  创建主题
  private createTopic(item: any) {
    this.dialogFlag = true;
    this.dialogShow = 1;
    this.formObj.btnName = ["立即提交"];
    this.formObj.title = "创建主题";
    this.formObj.methodName = "addTopic"; // 立即提交

    // if 增加字段
    if (item) {
      this.formObj.title = "添加字段";
      this.formObj.formObj.canNotEdit = true;
      this.formObj.formObj.interfaceType = item.topicInterFaceType;
      this.formObj.formObj.topicName = item.topicName;
      this.formObj.formObj.messageType = item.queneType;
      this.formObj.formObj.id = item.id;
      this.formObj.formObj.redisTimer = item.redisTimer;
      this.formObj.formObj.writeElasticsearch = item.writeElasticsearch;
      this.formObj.formObj.dataStructSchema = item.dataStructSchema;
      this.formObj.formObj.type = item.type;
      this.formObj.formObj.body = item.body;
      this.formObj.formObj.url = item.url;
      this.formObj.formObj.dataBaseIp = item.dataBaseIp;
      this.formObj.formObj.databaseType = item.dataBaseType;

      this.formObj.formObj.port = item.port;
      this.formObj.formObj.host = item.host;
      this.formObj.formObj.baseUrl = item.baseUrl;
      this.formObj.formObj.userName = item.userName;
      this.formObj.formObj.password = item.password;

      this.formObj.formObj.AuthorizationObj = {
        key: "***",
        value: "***",
      };
      this.formObj.formObj.header = JSON.parse(item.header);
      if (this.otherObj[0]) {
        this.formObj.formObj.dataBaseIp = this.otherObj[0].dataBaseIp || "";
        this.formObj.formObj.databaseType = this.otherObj[0].dataBaseType || "";
        this.formObj.formObj.header = JSON.parse(this.otherObj[0].header) || "";
        this.formObj.formObj.url = this.otherObj[0].url || "";
      }

      let obj1: any = JSON.parse(item.dsAnnotation); // 描述
      let obj3: any = JSON.parse(item.dataStruct)[0];
      this.formObj.formObj.topicList = [];
      for (let k in obj1) {
        this.formObj.formObj.topicList.push({
          key: k,
          type:
            typeof obj3[k] === "number" && obj3[k] > 1 ? "TimeStamp" : obj3[k],
          description: obj1[k],
          disabled: true,
        });
      }
    }
  }
  //  提交创建
  private addTopic(formObj: TopicAdd) {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        let dataStruct: any = {};
        let dataStructNumber: any = {};
        let description: any = {};

        formObj.topicList.forEach((val, index) => {
          dataStruct[val.key] = val.description;
          dataStructNumber[val.key] =
            val.type === "1"
              ? Number(val.type)
              : val.type === "TimeStamp"
              ? Date.now()
              : val.type;
        });
        let _numberS = JSON.stringify(dataStruct);
        let _keyS = "[" + JSON.stringify(dataStructNumber) + "]";
        let params: any = {
          dataStruct: _keyS,
          structMapping: "",
          dsAnnotation: _numberS,
        };

        if (!formObj.canNotEdit) {
          switch (formObj.interfaceType) {
            case 1:
              params.topicInterFaceType = formObj.interfaceType;
              params.topicName = formObj.topicName;
              params.queneType = formObj.messageType;
              params.redisTimer = formObj.redisTimer;
              params.writeElasticsearch = formObj.writeElasticsearch;
              break;
            case 2:
              params.topicInterFaceType = formObj.interfaceType;
              params.topicName = formObj.topicName;
              params.dataBaseType = formObj.databaseType;
              params.dataBaseIp = formObj.dataBaseIp;
              break;
            case 3:
              // 只在添加的时候 转base64
              if (
                formObj.AuthorizationObj.key !== "" &&
                formObj.AuthorizationObj.value !== ""
              ) {
                formObj.header.unshift(
                  this.authorizationBase64(formObj.AuthorizationObj)
                );
              }
              params.topicInterFaceType = formObj.interfaceType;
              params.topicName = formObj.topicName;
              params.url = formObj.url;
              params.header = JSON.stringify(formObj.header);
              params.type = formObj.type;
              params.body = formObj.body.replace(/\s+/g, "");
              break;
            case 4:
              params.topicInterFaceType = formObj.interfaceType;
              params.topicName = formObj.topicName;
              params.queneType = formObj.messageType;
              params.redisTimer = formObj.redisTimer;
              params.writeElasticsearch = formObj.writeElasticsearch;
              params.dataStructSchema = formObj.dataStructSchema.replace(
                /\s+/g,
                ""
              );
              delete params.dataStruct;
              delete params.structMapping;
              delete params.dsAnnotation;
              break;
            case 5:
              params.topicInterFaceType = formObj.interfaceType;
              params.topicName = formObj.topicName;
              params.port = formObj.port;
              params.host = formObj.host;
              params.baseUrl = formObj.baseUrl;
              params.userName = formObj.userName;
              params.password = formObj.password;
              delete params.dataStruct;
              delete params.structMapping;
              delete params.dsAnnotation;
              break;
            case 6:
              if (!this.file) {
                break;
              }
              this.forms.append("protoFile", this.file);
              this.forms.append("redisTimer", formObj.redisTimer.toString());
              this.forms.append("topicName", formObj.topicName.toString());
              break;
          }
        } else {
          params.id = formObj.id;
        }
        // protobuf情况下需要formData文件上传，与现有axios拦截逻辑不同
        if (formObj.interfaceType !== 6) {
          const { success } = await this.h_request["httpPOST"](
            !formObj.canNotEdit ? "POST_TOPICS_ADD" : "POST_TOPICS_UPDATE",
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
          }
          resolve(success);
        } else {
          // protobuf文件上传
          // 如果此处vetur报错，请将工程文件放在vscode根目录下 https://github.com/vuejs/vetur/issues/2602
          axios({
            method: "post",
            url: process.env.VUE_APP_BASE_API + "/topics/addProtobufTopic",
            data: this.forms,
            timeout: 500000,
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: rootStoreModule.UserState.token,
            },
          })
            .then(({ data }) => {
              if (data.success) {
                this.h_utils["alertUtil"].open("主题创建成功", true, "success");
                this.searchMethod(
                  false,
                  {
                    pageSize: this.pageSize,
                    pageNum: 1,
                  },
                  this.tab ? true : false
                );
              } else {
                console.log(data);
                alertUtil.open(
                  "错误代码：" + data.code + "，错误信息：" + data.message,
                  true,
                  "error"
                );
              }
              resolve(data.success);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    );
  }

  private createProtobufFile(file: File) {
    this.file = file;
  }

  private authorizationBase64(obj: any) {
    return {
      key: "Authorization",
      value: "Basic " + window.btoa(obj.key + ":" + obj.value + ""),
    };
  }
  //查询通用调用方法
  private async searchMethod(bool: boolean, params: object, tab?: boolean) {
    if (tab) {
      const { data }: returnDataType = bool
        ? await this.h_request["httpGET"]<object>(
            "GET_TOPICS_MYTOPICSBYID",
            params
          )
        : await this.h_request["httpGET"]<object>(
            "GET_TOPICS_MYTOPICS",
            params
          );
      // console.log(data);
      this.desserts = data.list.map((item: any) => {
        return { ...item, flag: false };
      });
      this.paginationLength = Math.floor(data["total"] / this.pageSize + 1);
    } else {
      const { data }: returnDataType = bool
        ? await this.h_request["httpGET"]<object>(
            "GET_TOPICS_SELECTTOPIC",
            params
          )
        : await this.h_request["httpGET"]<object>(
            "GET_TOPICS_FIND_ALL",
            params
          );
      // console.log(data);
      this.desserts = data.list.map((item: any) => {
        return { ...item, flag: false };
      });
      this.paginationLength = Math.floor(data["total"] / this.pageSize + 1);
    }
  }

  //主题查询
  private searchTopic() {
    if (!this.queryTopicID) {
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
          topicID: this.queryTopicID == "" ? 0 : this.queryTopicID,
          pageNum: 1,
          pageSize: this.pageSize,
        },
        !!this.tab
      );
    }
  }

  //tab切换方法
  private tabChange(tab: number) {
    this.pageNum = 1;
    this.searchMethod(
      false,
      {
        pageSize: this.pageSize,
        pageNum: 1,
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
    this.dataStructure(item, "数据结构详情");
  }

  private addFileds(item: any) {
    this.createTopic(item);
  }

  private async getTopicInformation(item: any, index: number) {
    let info: any = {};
    if (!this.desserts[index].flag) {
      const { data }: any = await this.h_request["httpGET"](
        "GET_TOPICS_INFORMATION",
        {
          topicID: item.id,
          topicName: item.topicName,
          topicInterFaceType: item.topicInterFaceType,
        }
      );

      if (data.length > 0) {
        this.desserts[index].dataBaseIp = data[0].dataBaseIp;
        this.desserts[index].dataBaseType = data[0].dataBaseType;
        this.desserts[index].url = data[0].url;
        this.desserts[index].header = data[0].header;
      }
      // info = {...data[0],topicInterFaceType:item.topicInterFaceType,redisTimer:item.redisTimer}
      this.desserts[index].flag = true;
    }
    this.ancillaryInformation(this.desserts[index], "附加信息");
  }

  private async deleteTopic() {
    if (this.HConfirmItem.id === undefined) {
      return;
    }
    const { success } = await this.h_request["httpGET"]("GET_TOPICS_DELETE", {
      topicID: this.HConfirmItem.id,
      topicName: this.HConfirmItem.topicName,
      topicInterFaceType: this.HConfirmItem.topicInterFaceType,
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
  public openUpload(e: Event) {
    this.upLoadFlag = true;
  }

  // 上传文件
  private upLoadFile(e: File[]) {
    const file = e as any;
    if (!file) {
      return;
    }
    // xlsx 或者 xls 格式才能上传
    if (
      file.type === "application/vnd.ms-excel" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const { SheetNames, Sheets } = XLSX.read(data, { type: "array" });

        this.canUpLoad = true;
        this.SheetNames = SheetNames;
        this.Sheets = Sheets;
        this.fileName = file.name.split(".")[0];
      };
      reader.readAsArrayBuffer(file);
    }
  }
  private handleObjKey(k: string) {
    switch (this.sheetObj[`${k}1`].v) {
      case "字段名":
        return "key";
      case "字段类型(Int,String,TimeStamp)":
        return "type";
      case "字段含义":
        return "description";
    }
  }
  // ['序号','字段名','字段类型(Int,String,TimeStamp)','字段含义']
  // this.formObj.formObj.topicList.type 转义
  private handleObjKeyType(k: string) {
    switch (k) {
      case "Int":
        return 1;
      case "String":
        return "str";
      case "TimeStamp":
        return "TimeStamp";
      default:
        return k;
    }
  }
  //  确定上传
  private async upLoadFileConfirm() {
    this.createTopic(false);

    this.upLoadFlag = false;
    this.canUpLoad = false;
    this.forceRenderFlag = Math.random();

    this.formObj.formObj.messageType = 1;
    this.Sheets[`sheet${this.sheetCurIndex}`] &&
      (this.sheetObj = this.Sheets[`sheet${this.sheetCurIndex}`]);
    const _l: number = this.sheetObj["!ref"].split("C")[1];

    let _topicList: Array<any> = [];
    for (let i = 1; i < _l; i++) {
      _topicList.push({
        [this.handleObjKey("A") as string]: this.handleObjKeyType(
          this.sheetObj[`A${i + 1}`] ? this.sheetObj[`A${i + 1}`].v : ""
        ),
        [this.handleObjKey("B") as string]: this.handleObjKeyType(
          this.sheetObj[`B${i + 1}`] ? this.sheetObj[`B${i + 1}`].v : ""
        ),
        [this.handleObjKey("C") as string]: this.handleObjKeyType(
          this.sheetObj[`C${i + 1}`] ? this.sheetObj[`C${i + 1}`].v : ""
        ),
        disabled: false,
      });
    }
    // 获取dom
    await this.$nextTick();
    const child = this.$refs.createTopicDialog as CreateTopicDialog;

    setTimeout(() => {
      this.formObj.formObj.topicName = this.fileName;
      child.inputEvent(this.fileName);
      this.formObj.formObj.topicList = [..._topicList];
    }, 1);
  }
  // 取消上传
  private upLoadFileCancel() {
    this.upLoadFlag = false;
    this.canUpLoad = false;

    this.forceRenderFlag = Math.random();

    this.SheetNames = [""];
    this.Sheets = {};
    this.fileName = "";
  }

  // 下载
  private async downloadFile(item: any) {
    axios({
      method: "get",
      url: process.env.VUE_APP_BASE_API + "/topics/protobufDownload",
      params: { id: item.id },
      timeout: 500000,
      responseType: "blob",
      headers: {
        Authorization: rootStoreModule.UserState.token,
      },
    })
      .then((res) => {
        console.log(res);
        const filename = res.headers["content-disposition"]
          ? res.headers["content-disposition"].split("=")[1]
          : "proto.zip";
        const blob = new Blob([res.data], {
          type: "application/octet-stream",
        });
        const tempLink = document.createElement("a");
        const blobURL = window.URL.createObjectURL(blob);

        tempLink.style.display = "none";
        tempLink.href = blobURL;
        tempLink.setAttribute("download", decodeURI(filename));

        if (typeof tempLink.download === "undefined") {
          tempLink.setAttribute("target", "_blank");
        }
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
        window.URL.revokeObjectURL(blobURL);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
</script>
<style scoped>
.dialog-title {
  text-align: center;
  display: block;
}
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
