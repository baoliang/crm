(ns zhongzubao.test.logic.yeepay-test
  (:use clojure.test
        ring.mock.request)
  (:require
    [baotask.service :as db]
    [zhongzubao.logic.yeepay :as yeepay]))

(deftest test-app
  (testing "dolaon"
    (yeepay/update-success "1c1bdecb-f00c-4eb8-9740-93176f2da596" "LOAN"  "1" "")
    )
  (testing "repayment"
    (yeepay/repayment @db/db-pool "ZTH011421717684151" 1)
    ))
