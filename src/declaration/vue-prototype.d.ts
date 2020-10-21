import Vue from 'vue';
import VueRouter, { Route } from 'vue-router';
import { CombinedVueInstance } from 'vue/types/vue';
import {
  returnDataType
} from "../type/http-request.type"
import { dialogForm } from '../type/dialog-form.type';

export interface H_Vue extends CombinedVueInstance<Vue, dialogForm, object, object, Record<never, any>>{}



type Request = {
  httpGET: <T>(requestName: string, params:T,...urlArr:Array<string>) => Promise<returnDataType>
  httpPOST: <T>(requestName: string, params: T, ...urlArr: Array<string>) => Promise<returnDataType>
  httpPUT: <T>(requestName: string, params: T, ...urlArr: Array<string>) => Promise<returnDataType>
  httpAll: <T>(params:Array<T>) => Promise<Array<returnDataType>>
}

type Request2 = {
  [key:string]:string
}

declare module "vue/types/vue" {
  interface Vue{
    h_request: Request
    h_request2:Request2
    h_echars: any
    h_utils: any
    h_enum: any
    h_validator:any
    $request: Request
    // $echars:any
    $router: VueRouter
    $route: Route
  }
}
