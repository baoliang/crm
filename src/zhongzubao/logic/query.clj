(ns zhongzubao.logic.query
  (:require [compojure.core :refer :all]
            [baotask.bl.db :as db]
            [clj-time.core :as time]
            [taoensso.timbre :as timbre]
            [baotask.utils :as utils]
            [clj-time.coerce :as c]
            [baotask.storage :as st]))



(defn get-data-by-page
  "根据表名获取分页数据"
  ([table page pagesize query]
    (st/page  {:select [:*]
               :from [table]
               :where query}
              page
              pagesize))
  ([table page ]
    (get-data-by-page table page 10 nil))
  ([table page  pagesize ]
    (get-data-by-page table page pagesize nil)))


(defn get-data-by-id
  "根据表名及Id获取数据"
  [table id]
  (st/get-by-id table id))

(defn get-data-by-colum [table colum id]
  (st/get-by-colum-value table colum id))


