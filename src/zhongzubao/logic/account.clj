(ns zhongzubao.logic.account
  (:require [compojure.core :refer :all]
            [baotask.bl.db :as db]
            [baotask.storage :as st]))




(defn get-by-id [id]
  "根据id获取帐号信息"
  (st/get-by-colum-value :accounts :userId id))


(defn valid-login-token [token name]
  (let [token-record (st/get-by-colum-value :tokens :token token)]
    (if (and  token-record (not (:is_use token-record)))
      (do
        (st/update-by-id :tokens (:id token-record) {:is_use 1})
        true)
      false)))

(defn get-reward-page-by-user-name [user-name page catlog]
  "根据id获取帐号信息"
  (let [query (case catlog
                "0" [:and [:= :userId user-name] [:= :used 0] [:< (db/sql-now) :expireTime ]]
                "1" [:and  [:= :userId user-name] [:= :used 1] [:= :userId user-name]]
                "2" [:and  [:= :userId user-name][:= :used 0] [:> (db/sql-now) :expireTime ]])]
    (st/page  {:select [:*]
               :from [:rewards]
               :where query}
              page)))

(defn update-account-bank-by-name
  "更新绑卡状态"
  [username  bankCardNo cardStatus bank]
  (st/update-table :accounts
                   [:= :userId username]
                   {:yeepayBindcardCardno bankCardNo
                    :yeepayBindcardBank bank
                    :yeepayBindcardIsok (if (= cardStatus "VERIFIED") 1 0)} ))

