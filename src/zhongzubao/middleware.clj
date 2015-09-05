(ns zhongzubao.middleware
  (:require [baotask.log :as log]
            [noir.session :as session]
            [noir.response :refer [redirect]]
            [baotask.layout :as layout]
            [clj-stacktrace.core :refer [parse-exception]]))

(def mode (atom nil))

(defn set-mode! [m]
  (reset! mode m))



(defn wrap-internal-error [f]
  (fn [request]
    (try
      (if  (or (= (:uri request) "/") (= (:uri request) "/application_form") (= (:uri request) "/xxx/xxx")  (= (:uri request) "/quit")  (= (:uri request) "/login") (= (:uri request) "/apply") (= (:uri request) "/code"))
        (f request)
        (if (or (session/get  :admin ) (session/get  :user ) (session/get  :is_super_admin ))
          (f request)
          (redirect "/")))

      (catch Throwable exception
        (log/fatal exception {:request request})
        (if (= :dev @mode)
          (throw exception)
          (layout/resp-500))))))




