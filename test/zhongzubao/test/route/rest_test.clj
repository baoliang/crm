(ns zhongzubao.test.route.rest-test
  (:use clojure.test)
  (:require  [clj-http.client :as client]))

(deftest test-zhongchou
  (testing "get caption page"
    (let [response (client/get "http://localhost:3000/rest/get-zhongchou-by-page/1/8/0")]
      (is (= 200 (:status response)))))
  (testing "get captionn rewards "
    (let [response (client/get "http://localhost:3000/rest/get-reward-by-heroid/1")]
      (is (= 200 (:status response)))))
  (testing "get  data  by id"
    (let [response (client/get "http://localhost:3000/rest/get-data-by-id/zhongchou_rewards/1")]
      (is (= 200 (:status response)))))
  (testing "get  yeepay  by id"
    (let [response (client/get "http://localhost:3000/rest/get-yeepay-by-request-no/1dd45f8a-61b6-462e-9d08-3897df1546d6")]
      (is (= 200 (:status response)))))

  (testing "get  data page "
    (let [response (client/get "http://localhost:3000/rest/get-data-by-page/payments/1/10")]
      (is (= 200 (:status response)))))

  (testing "get caption by id"
    (let [response (client/get "http://localhost:3000/rest/get-hero-by-id/1")]
      (is (= 200 (:status response))))))
