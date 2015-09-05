(ns zhongzubao.views.helper
  (:require [compojure.core :refer :all]
            [noir.session :as session]
            [noir.response :as response]
            [baotask.storage :as st]
            [baotask.config :as config]
            [baotask.utils :as utils]
            [baotask.bl.db :as db]

            [baotask.layout :as layout]
            [zhongzubao.logic.user :as user]))





(defn admin-wrap
  []
  config/config)