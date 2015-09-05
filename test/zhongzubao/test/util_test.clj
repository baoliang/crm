(ns zhongzubao.test.util-test
  (:use clojure.test
        ring.mock.request)
  (:require

    [zhongzubao.util  :as util]))

(deftest test-app
  (testing "get interest"
    (println "rate is " (util/get-interest-rate  {:startMoney 1000 :startInterestRate 10
                                                  :moneyIncrease 1000 :interestRateIncrease 0.1
                                                  :highestMoney 9900 :id 46} 3000))
    (println "interest " (util/get-interest 3000 [{:startMoney 200 :startInterestRate 9
                                                   :moneyIncrease 100 :interestRateIncrease 0.1
                                                   :highestMoney 900 :id 45}
                                                  {:startMoney 1000 :startInterestRate 10
                                                   :moneyIncrease 1000 :interestRateIncrease 0.1
                                                   :highestMoney 9900 :id 46}
                                                  {:startMoney 10000 :startInterestRate 11
                                                   :moneyIncrease 0 :interestRateIncrease 0
                                                   :highestMoney 100000 :id 47}] 47 360))
    (= 301.80 (util/get-interest 3000 [{:startMoney 200 :startInterestRate 9
                                        :moneyIncrease 100 :interestRateIncrease 0.1
                                        :highestMoney 900 :id 45}
                                       {:startMoney 1000 :startInterestRate 10
                                        :moneyIncrease 1000 :interestRateIncrease 0.1
                                        :highestMoney 9900 :id 46}
                                       {:startMoney 10000 :startInterestRate 11
                                        :moneyIncrease 0 :interestRateIncrease 0
                                        :highestMoney 100000 :id 47}] 47 360))))
