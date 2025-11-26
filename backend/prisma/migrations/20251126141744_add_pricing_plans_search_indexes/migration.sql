-- CreateIndex
CREATE INDEX "pricing_plans_name_idx" ON "pricing_plans"("name");

-- CreateIndex
CREATE INDEX "pricing_plans_is_active_bundle_type_order_idx" ON "pricing_plans"("is_active", "bundle_type", "order");
