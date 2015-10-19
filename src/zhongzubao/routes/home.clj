(ns zhongzubao.routes.home
  (:use org.httpkit.server)
  (:require [compojure.core :refer :all]
            [noir.session :as session]
            [noir.response :as response]
            [baotask.storage :as st]
            [baotask.config :as config]
            [baotask.utils :as utils]
            [baotask.service :as service]
            [clojure.java.jdbc :as jdbc]
            [taoensso.carmine :as car :refer (wcar)]
            [honeysql.core :as sql]
            [zhongzubao.logic.data :as data]
            [baotask.api :as api]
            [baotask.layout :as layout]
            [zhongzubao.logic.user :as user]))

(def redis-conn {:pool {}
                 :spec {:host (get-in config/config ["redis" "host"])
                        :port (get-in config/config ["redis" "port"])}})

(defmacro wcar* [& body] `(car/wcar redis-conn ~@body))
(def clients (atom {}))

(defn ws
  [req]
  (with-channel req con
                (if  (:is_admin (session/get :user))
                  (do

                    (swap! clients assoc con true)

                    (wcar*
                           (car/set (str con) (:id (session/get :user))))
                    (on-close con (fn [status]
                                    (swap! clients dissoc con)))))))


(defroutes home-routes
           (GET "/" []
                (let [user (session/get :user)]
                  (if user
                    (if (:is_super_admin user)
                      (response/redirect  "/admin/applies")
                      (if (:is_admin user)
                        (layout/render "admin.html")
                        (layout/render "admin.html")))
                    (layout/render "login.html"))))
           (GET "/ws" [] ws)
           (GET "/statistics/sources/:name" [name]

             (case name
               "status"
               (response/json (st/query (format "select count(id), data->>'status' as status from kvs where scope='sources' and company_id='%s' group by data->>'status'"
                                        (:company_id (session/get :user)))))
               "province"
               (response/json (st/query (format "select count(id), data->>'province' as status from kvs where scope='sources' and company_id='%s' group by data->>'province'"
                                        (:company_id (session/get :user)))))
               "city"
               (response/json (st/query (format "select count(id), data->>'city' as status from kvs where scope='sources' and company_id='%s' group by data->>'city'"
                                        (:company_id (session/get :user)))))
               "get-sales"
               (response/json (st/query (format "select count(id), data->>'get-sales' as status from kvs where scope='sources' and company_id='%s' group by data->>'get-sales'"
                                        (:company_id (session/get :user)))))
               "create-sales"
               (response/json (st/query (format "select count(id), data->>'create-sales' as status from kvs where scope='sources' and company_id='%s' group by data->>'create-sales'"
                                        (:company_id (session/get :user)))))))
           (GET "/quit" []
                (do
                  (session/remove! :user )
                  (response/redirect "/")))
           (GET "/apply" [] (layout/render "application_form.html"))
           (GET "/code" []
                (let [code (clojure.string/join "" (take 4 [(rand-int 9) (rand-int 9) (rand-int 9) (rand-int 9)]))]
                  (session/put! :code code)
                  (api/gen-captcha 100 30 code)))
           (POST "/application_form" [phone name user_validate]
                 (if (= user_validate (session/get :code))
                   (do
                     (st/insert :applications {:phone phone :name name})
                     (response/json {:success true}))
                   (response/json {:success false :desc "验正码错误"})))
           (GET "/login" []   (layout/render "login.html"))

           (GET "/security" [] (layout/render "security.html"))
           (POST "/security/change-password" [password]
                 (st/update-table :users [:= :phone (:phone (session/get :user))] {:password (utils/en-password password)})
                 (layout/render "security.html" {:success true}))
           (GET "/data/:table" [table page keyword source source-id]
                (layout/render (str table ".html") (merge (data/get-data-page table  page (:company_id (session/get :user)) keyword) {:source source :source-id source-id} )))
            (GET "/records" [page keywords]
             (layout/render "records.html"  (merge (data/get-data-page "records"
                                                                       (if page (Integer/parseInt page) 1)
                                                                       (:company_id (session/get :user))
                                                                       keywords
                                                                       [(keyword "@>")
                                                                        :data
                                                                        (utils/to-pg-json {:sales (:name (session/get :user))})]))))
           (GET "/records/:source/:source-id" [page keywords source source-id]
             (layout/render "records.html"  (merge (data/get-data-page "records"
                                                                 (if page (Integer/parseInt page) 1)
                                                                 (:company_id (session/get :user))
                                                                 keywords
                                                                 [(keyword "@>")
                                                                  :data
                                                                  (utils/to-pg-json {:source-id source-id})])
                                             {:source source :source-id source-id})))

           (GET "/sources" [page keywords status]
             (layout/render "sources.html"  (merge (data/get-data-page "sources"
                                                                       (if page (Integer/parseInt page) 1)
                                                                       (:company_id (session/get :user))
                                                                       keywords
                                                                       [:or
                                                                        [(keyword "@>")
                                                                         :data
                                                                         (utils/to-pg-json {:sales (:name (session/get :user))})]
                                                                        (if status [(keyword "@>")
                                                                                    :data
                                                                                    (utils/to-pg-json {:status status})])]
                                                                        ) {:status status})))


           (GET "/sources-pool" [page keywords]
             (layout/render "sources-pool.html"  (merge {:sett-limit (st/kv-get "settings" (str "sources-limit-" (:company_id (session/get :user))))}
                                                        (data/get-data-page "sources"
                                                                            (if page (Integer/parseInt page) 1)
                                                                            (:company_id (session/get :user))
                                                                            keywords
                                                                            [(keyword "@>")
                                                                             :data
                                                                             (utils/to-pg-json {:sales "无"})]))))

           (GET "/sources-pool/get-task/:id" [id]
             (let [sett (st/kv-get "settings" (str "sources-limit-" (:company_id (session/get :user))))
                   down (if sett (sett "down") 0)
                   sales (:name (session/get :user))
                   task (st/kv-get "sources" id)
                   count-task-today (st/list-count-query :kvs
                                       [:and [:= :del false]
                                       [:= :scope "sources"]
                                        [(keyword "@>")
                                         :data
                                         (utils/to-pg-json {:sales (:name (session/get :user))})]
                                       [:= :company_id   (:company_id (session/get :user))]
                                       [:>= :update_time (utils/get-current-day-sql-time-start)]
                                        [:<= :update_time (sql/call :now)]])]
               (if (or (= 0 down) (< count-task-today down) (= true (:is_admin (session/get :user))))
                      (do
                        (doseq [client @clients]
                          (if (= (str (:id (session/get :user)))
                                 (wcar*
                                   (car/get (.toString (key client)))))
                            (do
                              (send! (key client) (format "%s已领取线索学员名为-%s" (:name (session/get :user)) (task "name")) false)
                              (swap! clients assoc client true))))
                        (st/kv-update "sources"  id {"sales" sales :get-sales  sales})
                        (response/json {:success true}))
                      (do
                        (response/json {:success false :desc "超过限制领取数量"})))))

           (GET "/sources/edit" [id source source-id]
             (let [sett (st/kv-get "settings" (str "sources-limit-" (:company_id (session/get :user))))
                       up (if sett (sett "up") 0)

                       count-task-today (st/list-count-query :kvs
                                                             [:and [:= :del false]
                                                              [:= :scope "sources"]
                                                              [(keyword "@>")
                                                               :data
                                                               (utils/to-pg-json {:sales (:name (session/get :user))})]
                                                              [:= :company_id   (:company_id (session/get :user))]
                                                              [:>= :update_time (utils/get-current-day-sql-time-start)]
                                                              [:<= :update_time (sql/call :now)]])]
                      (if (or (= 0 up) (< count-task-today up) (= true (:is_admin (session/get :user))))
                        (layout/render "sources-edit.html"
                                       (assoc (if id (st/kv-get "sources" id) {})
                                         :sales (st/list-by-where :users [:and [:= :del false] [:=  :company_id  (:company_id (session/get :user))]])
                                         "source"  source
                                         "source-id" source-id))
                        (layout/render "tips.html" {:tips (str "每日最多添加" up "个线索")}))))

           (POST "/sources/edit" {params :params}
             (if-not (empty? (:key params))
               (st/kv-update (:table params) (:key params) (dissoc params :table ))
               (st/kv-insert (:table params) (utils/uuid)  (assoc (dissoc params :table)  :create-sales (:name (session/get :user))) (:company_id (session/get :user))))
             (response/redirect (if (= (:sales params) "无") "/sources-pool"  "/sources")))


           (POST "/sources-pool/set-limit" [up down]
             (let [ key  (str "sources-limit-" (:company_id (session/get :user)))
                   sett (st/kv-get "settings" key)
                   value {:up (Integer/parseInt up) :down (Integer/parseInt down)}]
               (if sett
                 (st/kv-update "settings" key value)
                 (st/kv-insert "settings" key value )))
             (response/json {:success true}))

           (GET "/data/edit/:table" [table id source source-id]
                (layout/render (str table "-edit.html")
                               (assoc (if id (st/kv-get table id) {})
                                       :sales (if (= table "sources") (st/list-by-where :users [:and [:= :del false] [:=  :company_id  (:company_id (session/get :user))]]))
                                       "source"  source
                                       "source-id" source-id)))

           (POST "/data/edit" {params :params}
                 (if-not (empty? (:key params))
                   (st/kv-update (:table params) (:key params) (dissoc params :table ))
                   (st/kv-insert (:table params) (utils/uuid) (dissoc params :table) (:company_id (session/get :user))))
                 (do
                   (if (= (:table params) "records")
                     (st/kv-update "sources" (:source-id params)  {"status" (:status params)}))
                   (layout/render (str (:table params) ".html")
                                 (assoc (data/get-data-page (:table params)  1 (:company_id (session/get :user)) keyword)
                                   (if-not (empty? (:key params)) :edit :new) true))))
           
           
           (POST "/records/edit" {params :params}
                 (if-not (empty? (:key params))
                   (st/kv-update (:table params) (:key params) (dissoc params :table ))
                   (st/kv-insert (:table params) (utils/uuid) (dissoc params :table) (:company_id (session/get :user))))
                 (do
                     (st/kv-update "sources" (:source-id params)  {"status" (:status params)})
                   (response/redirect (format "/records/%s/%s" (:source params) (:source-id params)))))



           (GET "/data/del/:table" [table id]
                (st/kv-del table id)
                (layout/render (str table ".html") (assoc (data/get-data-page table  1 (:company_id (session/get :user)) keyword) :del true)))

           (GET "/users" [ page keyword]
                (layout/render "users.html" (st/get-data-by-page :users  page 1000 [:and  [:= :del false] [:= :company_id (:company_id (session/get :user))]])))
           (GET "/users/sources" [name  page ]
             (layout/render "sources.html" (merge (data/get-data-page "sources"
                                                                           (if page (Integer/parseInt page) 1)
                                                                           (:company_id (session/get :user))
                                                                           nil
                                                                           [(keyword "@>")
                                                                            :data
                                                                            (utils/to-pg-json {:sales name})]))))




           (GET "/users/edit" [id]
                (layout/render  "user-edit.html"  (if id (st/get-by-id :users (Integer/parseInt id)) {})))

           (POST "/users/edit" {params :params}
             (let [phone (st/list-by-colum-value :users :phone  (:phone params))
                   email (st/list-by-colum-value :users :email  (:email params))]
               (cond
                 (and (not-empty phone) (empty? (:id params))) (layout/render "user-edit.html" {:error "电话号码已经存在" :params params :id (:id params)})
                 (and (not-empty email) (empty? (:id params))) (layout/render "user-edit.html" {:error "邮箱已经存在" :params params :id (:id params)})
                 (or (not-empty (:id params)))
                  (do
                    (st/update-by-id :users (Integer/parseInt (:id params)) (dissoc params :id :password))
                    (layout/render "users.html"
                                   (merge {(if-not (empty? (:id params)) :edit :new) true}
                                          (st/get-data-by-page :users  1 1000 [:and [:= :del false]  [:= :company_id (:company_id (session/get :user))]]))))
                 :else (do
                         (st/insert :users  (assoc (dissoc params :id) :password (utils/en-password (:password params)) :company_id (:company_id (session/get :user))))
                         (layout/render "users.html"
                                        (merge {(if-not (empty? (:id params)) :edit :new) true}
                                               (st/get-data-by-page :users  1 1000 [:and [:= :del false]  [:= :company_id (:company_id (session/get :user))]])))))))

           (GET "/users/del/:id" [id]
                (st/update-by-id :users (Integer/parseInt id) {:del true})
                (layout/render "users.html" (merge {:del true} (st/get-data-by-page :users  1 1000 [:and [:= :del false] [:= :company_id (:company_id (session/get :user))]]))))

           (GET "/users/reset-password/:id" [id]
                (st/update-by-id :users (Integer/parseInt id) {:password (utils/en-password "111111")})
                (layout/render "users.html" (merge {:reset-password true} (st/get-data-by-page :users  1 1000 [:and [:= :del false] [:= :company_id (:company_id (session/get :user))]]))))


           (GET "/admin/applies" [page]
                (layout/render "admin/applications.html"
                               (st/get-data-by-page :applications (if page (Integer/parseInt page) 1) 10)))

           (GET "/admin/companies" [page]
                (layout/render "admin/companies.html"
                               (st/get-data-by-page :companies (if page (Integer/parseInt page) 1) 10)))
           (GET "/admin/add_company" [] (layout/render "admin/edit-company.html"))
           (GET "/admin/edit_company" [id uuid]
                (layout/render "admin/edit-company.html" (if id (merge {:edit true} (st/get-by-id :companies (Integer/parseInt id)) (st/get-by-colum-value :users :company_id uuid)))))

           (POST "/admin/edit_company" [id name phone email is_paid password]
                 (let [_is_paid (if is_paid true false)
                       company (if id (st/get-by-id :companies (Integer/parseInt id)))
                       UUID (if id (:uuid (st/get-by-id :companies (Integer/parseInt id))) (utils/uuid))
                       phone-is-exit (st/get-by-colum-value :users :phone phone)
                       email-is-exit (st/get-by-colum-value :users :email email)]

                     (jdbc/with-db-transaction [database @service/db-pool]
                                               (if id
                                                  (do
                                                     (st/update-by-id database :companies (Integer/parseInt id)  {:name name :phone phone :email email :is_paid _is_paid})
                                                     (st/update-table database :users   [:= :company_id UUID] {:name name :phone phone  :email email })
                                                     (st/update-table database :users [:and [:= :company_id UUID] [:= :is_admin true]] {:password (utils/en-password password)})
                                                     (response/redirect "/admin/companies"))
                                                 (if (or phone-is-exit email-is-exit)
                                                   (layout/render "admin/edit-company.html" {:name name :phone phone :email email :is_paid _is_paid :password password :phone-is-exit (if phone-is-exit "电话已存在") :email-is-exit (if email-is-exit "邮箱已存在")})
                                                   (let [company-id (st/insert database :companies {:name name :phone phone  :email email :is_paid _is_paid :uuid UUID})]
                                                     (st/insert database :users {:phone phone :name name  :email email :password (utils/en-password password)  :is_admin true :company_id UUID})
                                                     (response/redirect "/admin/companies")
                                                     ))))))
           (GET "/admin/is_over_application" [id]
                (st/update-by-id :applications (Integer/parseInt id) {:is_over true})
                (response/redirect "/admin/applies"))

           (POST "/login" [username password]
                 (let [success (user/login-user username password)
                       _user (first (st/list-by-where :users [:or [:= :email  username] [:= :phone  username]] ))
                       user (if success (assoc _user :company_name (:name (st/get-by-colum-value :companies :uuid (:company_id _user)))))]
                   (if success
                     (if (:is_super_admin user)
                       (do
                         (session/put!  :user user)
                         (response/redirect "/admin/applies"))
                         (do

                           (session/put! :user user)
                           (response/redirect "/")))
                     (layout/render "login.html" {:alert "密码错误" :username  username})
                     ))))


