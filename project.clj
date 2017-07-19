(defproject zhongzubao "0.1.0-SNAPSHOT"
            :description "FIXME: write description"
            :url "http://example.com/FIXME"
            :dependencies [[org.clojure/clojure "1.8.0"]
                           [lib-noir "0.9.5"]
                           [ring-server "0.4.0"]
                           [selmer "0.7.7"]
                           [clj-time "0.6.0"]
                           [digest "1.4.3"]
                           [ring-middleware-format "0.5.0"]
                           [environ "1.0.0"]
                           [http-kit "2.1.16"]
                           [clj-http "2.0.1"]
                           [org.clojure/core.match "0.3.0-alpha4"]
                           [compojure "1.4.0"]
                           [venantius/ultra "0.1.9"]
                           [baotask "0.1.2-SNAPSHOT"]
                           [org.clojure/data.json "0.2.4"]
                           [org.clojure/core.logic "0.8.10"]
                           [overtone/at-at "1.2.0"]
                           [org.clojure/data.xml "0.0.8"]
                           [org.clojure/test.check "0.6.1"]
                           [noir-exception "0.2.3"]
                           [clj-redis-session "2.1.0"]
                           [prone "0.8.0"]
                           ^:source-dep [instaparse "1.3.6"]
                           ]
            :uberjar-name "crm.jar"
            :repl-options {:init-ns zhongzubao.repl}
            :plugins []
            :main zhongzubao.core
            :user { :plugins [[org.clojars.bob-zhang/rui-mig "0.1.2"]]}
            :profiles
            {:uberjar {:omit-source true
                       :env {:production true}
                       :aot :all}}
            :min-lein-version "2.0.0")
