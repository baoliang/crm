(ns zhongzubao.core
  (:require
    [zhongzubao.handler :refer [app init init-dev]]
    [ring.middleware.reload :as reload]
    [org.httpkit.server :as http-kit]
    [zhongzubao.cron :as cron]
    [baotask.log :as log]
    [taoensso.timbre :as timbre])
  (:gen-class))

(defn dev? [args] (some #{"-dev"} args))

(defn port [args]
      (if-let [port (first (remove #{"-dev"} args))]
              (Integer/parseInt port)
              4000))

(defonce server (atom nil))



(defn start-server [args]
  (if (dev? args) (init-dev) (init))

  (reset! server
          (http-kit/run-server
            (if (dev? args) (reload/wrap-reload #'app) app)
            {:port (port args)
             :join? false})))

(defn stop-server []
  (when @server
    (.stop @server)
    (reset! server nil)))

(defn -main [& args]
  (let [port (port args)]
    (.addShutdownHook (Runtime/getRuntime) (Thread. stop-server))
    (start-server args)
    (log/info "start server at " port)))

