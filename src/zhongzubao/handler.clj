(ns zhongzubao.handler
  (:use
  ring.middleware.session
  [clj-redis-session.core :only [redis-store]])
  (:require [compojure.core :refer [defroutes]]
            [zhongzubao.routes.home :refer [home-routes]]
            [zhongzubao.middleware :refer [wrap-internal-error]]
            [noir.response :refer [redirect]]
            [baotask.layout :as layout]
            [noir.util.middleware :as middleware]
            [zhongzubao.middleware :refer [set-mode!]]
            [noir.util.middleware :refer [app-handler]]
            [ring.middleware.defaults :refer [site-defaults]]
            [baotask.config :as config]
            [taoensso.carmine.ring :as tmr]
            [taoensso.timbre :as timbre]
            [environ.core :refer [env]]))



(defn init
  []
  (timbre/set-config!
    [:shared-appender-config :rotor]
    {:path "coinexc.log" :max-size (* 512 1024) :backlog 10}))

(def redis-conn {:pool {}
                 :spec {:host (get-in config/config ["redis" "host"])
                        :port (get-in config/config ["redis" "port"])}})


(defn- mk-defaults
          "set to true to enable XSS protection"
          [xss-protection?]
          (-> site-defaults
                          (assoc-in [:security :anti-forgery] xss-protection?)))


(defn init-dev
  "init for developement mode, make sure selmer cache is off"
  []
  (layout/set-layout-cache false)
  (set-mode! :dev)
  (init))

(defn destroy
  "destroy will be called when your application
   shuts down, put any clean up code here"
  []
  (timbre/info "rui.site is shutting down..."))

(def app (middleware/app-handler
           ;; add your application routes here
           [home-routes]
           ;; add custom middleware here
           :middleware [wrap-internal-error]
           :ring-defaults (mk-defaults false)
           ;; add access rules here
           :access-rules []
           :session-options {:store       (redis-store redis-conn)
                             :cookie-name "zhongzubao"}
           ;:formats [:json-kw  :edn]
           ;; serialize/deserialize the following data formats
           ;; available formats:
           ; :formats [ :json-kw :yaml :yaml-kw :edn :yaml-in-html]
           ;:formats [:json-kw :edn]
           ))