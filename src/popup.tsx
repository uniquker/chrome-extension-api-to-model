import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import jquery from "jquery";
import { parseObject } from "./utils/analysis"
interface ApiModel {
	title: string,
	path: string,
	requestType: string,
	request: any,
	responseType: string,
	response: any
}
const Popup = () => {
  const [count, setCount] = useState(0);
  const [currentURL, setCurrentURL] = useState<string>();
	const [apiList, setApiList] = useState<Array<ApiModel>>([]);
	
  useEffect(() => {
    chrome.action.setBadgeText({ text: count.toString() });
  }, [count]);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      setCurrentURL(tabs[0].url);
    });
  }, []);

  const changeBackground = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      // if (tab.id) {
      //   chrome.tabs.sendMessage(
      //     tab.id,
      //     {
      //       color: "#555555",
      //     },
      //     (msg) => {
      //       console.log("result message:", msg);
      //     }
      //   );
      // }
			const id = tab?.url?.substr(tab?.url?.lastIndexOf('/') + 1)
			const u = new URL(tab?.url || '')
			// http://47.108.216.191:3001/api/interface/get?id=1274
			jquery.ajax({
				type: 'GET',
				url: u.origin + '/api/interface/get?id=' + id,
				headers: {
					// Referer: tab?.url,
					Accept: 'application/json, text/plain, */*'
				},
				success: (res: any) => {
					// console.log(res)
					(typeof res?.data === 'object' ? [res?.data]: res?.list || []).map((v : any) => {
						let req = {}, resp = {}
						try{
							req = JSON.parse(v.req_body_other || '')
						}catch(e) {
						}
						try{
							resp = JSON.parse(v.res_body || '')
						}catch(e) {
						}
						const item = {
							title: v.title,
							path: v.path,
							requestType: v.req_body_type,
							request: req,
							responseType: v.res_body_type,
							response: resp
						} as ApiModel;
						setApiList([...apiList, item]);
					})
					parseTsModel()
				}
			})
    });
  };

	function parseTsModel(){
		return apiList.map((v: ApiModel) => {
			let requestStr = '', properties = (v.request?.properties?.query?.properties || {}) as any;
			let responseStr = '', responseProperties = (v.response?.properties?.data?.properties || {}) as any;
			requestStr = parseObject(properties, 1, v.request?.properties?.query?.required || []);
			responseStr = parseObject(responseProperties, 1, v.response?.properties?.data?.required || []);
			let box = <div className="box">
				<p>{v.title}</p>
				<div>{v.path}</div>
				<textarea value={requestStr}></textarea>
				<textarea value={responseStr} className="h3"></textarea>
			</div>;
			return box;
		})
	}
	
  return (
    <div>
			<div className="box-btn">
				<button className="btn" onClick={changeBackground}>生成TS Model</button>
			</div>
			<div>
				{ parseTsModel() }
			</div>
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
