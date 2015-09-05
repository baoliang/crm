(ns zhongzubao.cron
  (:use overtone.at-at))

(def tp (mk-pool))
(defn start-cron []
  (after 10000 #(println "hello") tp :desc "Hello printer")
  ;(every 5000 #(println "I am still alive!") tp :desc "Alive task")
  )