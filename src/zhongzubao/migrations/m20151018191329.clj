(ns zhongzubao.migrations.m20151018191329
            (:require [clojure.java.jdbc :as sql]
                      [clojure.data.json :as json]))
              (def config
                (json/read-str (slurp "./config.json")))

            (def database
                {:subprotocol  (get-in config ["db" "subprotocol"])
                 :subname  (str  (str "//" (get-in config ["db"  "host"]) ":" (get-in config ["db"  "port"]) "/" (get-in config ["db" "db-name"]) (if (= "mysql" (get-in config ["db" "subprotocol"])) "?useUnicode=true&characterEncoding=UTF-8" "")))
                 :user (get-in config ["db" "user"])
                 :password (get-in config ["db" "password"])})
          
            (defn execute-in-db! [ & queries]
              (doseq [q queries]
                (sql/with-db-transaction [db database]
                                         (sql/execute! db   (if (string? q) [q] q)))))

            (defn up[]
              (execute-in-db! "ALTER TABLE  users ALTER COLUMN del SET DEFAULT false;"
                              "update users set del = false"))
          