(ns zhongzubao.logic.reward
  (:require [compojure.core :refer :all]
            [baotask.bl.db :as db]
            [clj-time.core :as time]
            [taoensso.timbre :as timbre]
            [baotask.utils :as utils]
            [clj-time.coerce :as c]
            [baotask.storage :as st]))

(defn get-valid-by-user-id "获取有效的投资卷"
  [id amount]
  (if (>=  (utils/parse-int amount) 3000)
    (first (st/list-by-where :rewards [:and [:= :userId id ] [:= :used 0]]))))


