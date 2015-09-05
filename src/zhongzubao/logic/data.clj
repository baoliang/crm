(ns zhongzubao.logic.data
  (:require [compojure.core :refer :all]
            [baotask.bl.db :as db]
            [clj-time.core :as time]
            [taoensso.timbre :as timbre]
            [baotask.utils :as utils]
            [clj-time.coerce :as c]
            [baotask.storage :as st]))



(defn get-data-page [table page  company-id key-word & query ]
  (println query)
  (let [datas
        (st/get-data-by-page
          :kvs
          (if page page 1)
          20
          (if query
                   [:and [:= :del false] [:= :scope table] [:= :company_id company-id] (first query)]
                    [:and [:= :del false] [:= :scope table] [:= :company_id company-id] ]))]
    (assoc datas :list (map #(merge % (utils/from-pg-json (:data %)) ) (:list datas)))))