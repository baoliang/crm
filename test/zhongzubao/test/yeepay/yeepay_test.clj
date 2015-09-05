(ns zhongzubao.test.yeepay.yeepay-test
  (:use clojure.test)
  (:require [zhongzubao.yeepay.yeepay-api :as yeepay]))

(deftest test-app
  (testing "main route"
    (is (= 0 (yeepay/ACCOUNT_INFO "zhaoxinxiong")))))
