(ns zhongzubao.util
  (:require [noir.io :as io]))



(defn- factor [no-of-decimal-places]
  (.pow (BigInteger. "10") no-of-decimal-places))

(defn truncate [value decimal-places]
  (let [divide-and-multiply-by (factor decimal-places)]
    (float (/ (int (* divide-and-multiply-by value)) divide-and-multiply-by))))

(defn get-span-period [repayment-way period]
  (let [period-number (case repayment-way
                        "1" (if (> 30 period) 1 (/ period 30))
                        "2" (if (> 90 period) 1 (/ period 90))
                        "3" (if (> 180 period) 1 (/ period 180))
                        "4" (if (> 360 period) 1 (/ period 360))
                        "5" 1)]
    (if (zero? (mod (float period-number) 1))
      (int period-number)
      (+ (int period-number) 1))))

(defn get-span-days [repayment-way period ]
  (case repayment-way
    "1" (if (> 30 period) period 30)
    "2" (if (> 90 period) period 90)
    "3" (if (> 180 period) period 180)
    "4" (if (> 360 period) period 360)
    "5" period))


(defn get-int-uper
  [number]
  (if (zero? (mod (float number) 1))
    (int number)
    (+ 1  (int number))))

(defn get-interval-type [second]
  (cond
    (> 60 second) "秒"
    (> 3600 second ) "分"
    (> 86400 second ) "时"
    :else "天"))


(defn get-interval-num [second]
  (cond
    (> 60 second) second
    (> 3600 second ) (get-int-uper (/ second 60 ))
    (> 86400 second ) (get-int-uper (/ second 3600 ))
    :else (get-int-uper (/ second 86400))))

(defn get-interest-rate [interest amount]
  (if (and (>= amount (+ (:startMoney interest) (:moneyIncrease interest))) (> (:moneyIncrease interest) 0))
    (last
      (take (+ 1 (int (/ (- amount (:startMoney interest)) (:moneyIncrease interest))))
            (iterate (partial + (:interestRateIncrease interest)) (:startInterestRate interest))))
    (:startInterestRate interest)))

(defn get-interest [amount interests max-money-id days]
  (let [interest (first (filter #(if (and (>= amount (:startMoney %))
                                          (<= amount (:highestMoney %)))
                                     true
                                     false)
                                interests))
        real-interest (if interest interest (first (filter #(= max-money-id (:id %)) interests)))
        ]
    (println "xx"  amount interests max-money-id days)
             (->   (/ (get-interest-rate real-interest amount) 365 100)
          float
          (* days amount)
          (truncate 2))
          ))