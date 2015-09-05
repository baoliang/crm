(ns zhongzubao.main (:gen-class)
  (:require [clojure.java.jdbc :as sql]
            [clj-time.local :as local]
            [baotask.config :refer [config]]
            [clojure.set :as set]))

(def database
  {:subprotocol  (get-in config ["db" "subprotocol"])
   :subname  (str  (str "//" (get-in config ["db"  "host"]) ":" (get-in config ["db"  "port"]) "/" (get-in config ["db" "db-name"]) (if (= "mysql" (get-in config ["db" "subprotocol"])) "?useUnicode=true&characterEncoding=UTF-8" "")))
   :user (get-in config ["db" "user"])
   :password (get-in config ["db" "password"])})

(defn completed-migrations []
  "获取已完成的脚本"
  (->> (sql/query database
                  ["SELECT name FROM migrations ORDER BY name DESC"])
       (map #(:name %))
       vec))

(defn -main[& args])
