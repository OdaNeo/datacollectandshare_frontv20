<template>
  <div id="topicSub">
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
    </v-row>
    <h-table
      :headers="headers"
      :desserts="desserts"
      :height="450"
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
          @click="dataStructure(item)"
        >
          数据结构详情
        </v-btn>
      </template>
      <template v-slot:operation="{ item }">
        <v-btn
          small
          text
          v-if="!item.status"
          color="primary"
          class="my-2"
          @click="subscribe(item)"
        >
          订阅
        </v-btn>
        <v-btn
          small
          text
          v-if="item.status"
          color="warning"
          class="my-2"
          @click="cancelScribe(item)"
        >
          取消订阅
        </v-btn>
      </template>
    </h-table>
    <h-dialog v-model="dialogFlag">
      <data-structure-dialog
        slot="dialog-content"
        :rowObj="rowObj"
      ></data-structure-dialog>
    </h-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Provide } from "vue-property-decorator";
import { VueConstructor } from "vue";
import { paramsType, returnDataType } from "../../../type/http-request.type";
import http from "../../../decorator/httpDecorator";
import { topicTable } from "../../../type/topic.type";
import HTable from "../../../components/h-table.vue";
import Enum from "@/decorator/enumDecorator";
import HDialog from "../../../components/h-dialog.vue";
import DataStructureDialog from "./childComponent/dataStructureDialog.vue";
@Component({
  components: {
    HTable,
    HDialog,
    DataStructureDialog,
  },
})
@http
@Enum([
  {
    tsFileName: "topic-list-enum",
    enumName: "queneType",
  },
])
export default class TopicSub extends Vue {
  @Provide("formProvide") private formObj = new Vue({
    data() {
      return {
        title: "",
        btnName: [] as string[],
        methodName: "",
        formObj: {},
      };
    },
  });
  private desserts: Array<topicTable> = [];
  private rowObj: object = {};
  private pageNum: number = 1;
  private pageSize: number = 20;
  private paginationLength: number = 0;
  private dialogFlag: boolean = false;
  private queryTopicID: string = "";
  headers = [
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
      value: "belongUserName",
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
      slot: "operation",
    },
  ];
  async searchMethod(bool: boolean, params: object) {
    const { data }: returnDataType = bool
      ? await this.h_request["httpGET"]<object>(
          "GET_TOPICS_SELECTTOPICBYTIDTNAME",
          params
        )
      : await this.h_request["httpGET"]<object>(
          "GET_TOPICS_FIND_ALL_TOPIC",
          params
        );
    this.paginationLength = Math.ceil(data["total"] / this.pageSize);
    this.desserts = data["list"];
  }

  private dataStructure(item: any) {
    this.dialogFlag = true;
    this.rowObj = item;
    this.formObj.title = "数据结构详情";
  }

  private searchTopic() {
    if (this.queryTopicID == "") {
      this.searchMethod(false, {
        pageSize: this.pageSize,
        pageNum: 1,
      });
    } else {
      this.searchMethod(true, {
        id: this.queryTopicID,
        pageSize: this.pageSize,
        pageNum: 1,
      });
    }
  }

  private async subscribe(item: any) {
    const { success } = await this.h_request[
      "httpPOST"
    ]("POST_SUBMODERATIONS_INSERTSUBMODERATION", { topicId: item.id });
    if (success) {
      this.searchMethod(false, {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
      });
    }
  }

  private async cancelScribe(item: any) {
    const { success } = await this.h_request[
      "httpPOST"
    ]("POST_TOPICS_DELSUBUSER", { topicID: item.id, subUserID: item.userID });
    if (success) {
      this.searchMethod(false, {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
      });
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
    );
  }
  created() {
    this.searchMethod(false, {
      pageSize: this.pageSize,
      pageNum: this.pageNum,
    });
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
