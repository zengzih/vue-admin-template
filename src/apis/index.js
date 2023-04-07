import {currying} from "@/apis/currying";

const request = currying('http://localhost:8848/')
export const login = request('login');

export const getCourseAll = request('getCourseAll');
