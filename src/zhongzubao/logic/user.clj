(ns zhongzubao.logic.user
  (:require [compojure.core :refer :all]
            [baotask.bl.db :as db]
            [clj-time.core :as time]
            [taoensso.timbre :as timbre]
            [baotask.utils :as utils]
            [clj-time.coerce :as c]
            [baotask.storage :as st]))

(defn create-user "注册用户"
  [username password email service-phone ref]
  (try
      (st/insert :user {:name username :servicePhone service-phone :password (utils/en-password password)  :regState "f" :email email :regTime (db/sql-now) :randomCode (str (rand-int 99999)) :ref ref})
      (st/insert :accounts {:userId username})
      (st/insert :rewards {:userId username :amount 50 :used 0 :giveTime (db/sql-now) :expireTime (c/to-sql-time (time/plus (time/now) (time/months 3))) :remark "注册"})
      (let [ref-user (st/get-by-id :user  ref)
            ]
        (if ref-user (do (st/insert :rewards {:userId (:name ref-user) :amount 50 :used 0 :giveTime (db/sql-now) :expireTime  (c/to-sql-time (time/plus (time/now) (time/months 3)))  :remark "推荐"})
                         (st/insert :rewards {:userId username :amount 50 :used 0 :giveTime (db/sql-now) :expireTime (c/to-sql-time (time/plus (time/now) (time/months 3))) :remark "邀请注册"}))))
    true
    (catch Exception e
      (timbre/info "error" e)
      false)))



(defn get-user-ref-page-by-user-id [user-id page]
  "根据id获取帐号信息"
  (st/page  {:select [:*]
             :from [:user]
             :where [:= :ref user-id]}
            page
            10))

(defn login-user "判断用户密码"
  [name password]
  (let [users (st/list-by-where :users [:or [:= :email  name] [:= :phone  name]] )]
    (println (first users))
    (if (not-empty users)
      (if (utils/password-check  password
                           (:password (first users)))
        true
        false)
      false)))

(defn change-password "更新用户密码"
  [name password]
  (let [user (st/get-by-colum-value :user :name name )]
    (if user
      (do
        (st/update-by-id :user (:id user) {:password (utils/en-password password)})
        true)
      false)))

