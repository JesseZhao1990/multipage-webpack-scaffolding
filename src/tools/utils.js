/* eslint-disable */

/**
 * rem 相关的工具
 * @param {*}  
 */
export const remUtil = {
  // 调整窗口或者翻转屏幕事件
  resizeEvent: 'orientationchange' in window ? 'orientationchange' : 'resize',
  // 事件句柄
  handlers: [],
  // 添加设置rem的事件
  addRemHandler: function(designWith){
    function recalc(){
      const docEl = document.documentElement;
      const clientWidth = docEl.clientWidth;
      if (!clientWidth) return;
      docEl.style.fontSize = 100 * (clientWidth / Number(designWith))+ 'px';
    };
      
    if (!document.addEventListener) return;
    const handler = throttle(recalc,500);
    remUtil.handlers.push(handler);
    window.addEventListener(remUtil.resizeEvent, handler, false);
    document.addEventListener('DOMContentLoaded', recalc, false);       
  },
  // 移除设置rem的事件
  removeRemHandler:function(){
    remUtil.handlers.forEach((handler)=>{
      window.removeEventListener(remUtil.resizeEvent, handler);
    })
  },
}

/**
 * 删除html上的行内style
 */
export function removeAttributeOfHtml(){
  const docEl = document.documentElement;
  if(!docEl) return;
  docEl.removeAttribute('style');
}

/**
 * viewport的宽度是否比某个值大
 * @param {*} width 
 */
export function isWider(width){
  const viewPortSize = getViewportSize();
  if(viewPortSize.width>width){
    return true;
  }
  return false;
}

/**
 * 获取viewport的宽高
 */
export function getViewportSize () {
  return {
      width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
      height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  };
}

/**
 * 设置样式
 * @param {*} href 
 */
export function setLink(className) {
  let heads = document.getElementsByTagName('head');
  let htmlTags = document.getElementsByTagName('html');
  let htmlTag = htmlTags ? htmlTags[0] : null;
  htmlTag.setAttribute('class',className);
}

/**
 * 节流函数，你懂的。
 */
export function throttle(action,delay){
  let timeout = null;
  let lastRun = 0 ;
  return function(){
    if(timeout) return;
    let elapsed = Date.now()- lastRun
    let context = this;
    let args = arguments;
    let runCallback = function(){
      lastRun = Date.now();
      timeout = false;
      action.apply(context,args);
    }
    if(elapsed>=delay){
      runCallback();
    } else {
      timeout = setTimeout(runCallback,delay);
    }
  }
}