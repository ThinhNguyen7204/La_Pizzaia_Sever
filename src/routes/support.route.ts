import { Router } from 'express'
import {
  createSupportController,
  getDetailSupportController,
  getListSupportController,
  getMySupportsController,
  updateSupportController
} from '~/controllers/support.controller'
import { requireManagerOrSales, requireLogined } from '~/middlewares/auth.middleware'
import { validateRequest } from '~/middlewares/validator.middleware'
import { wrapRequestHandler } from '~/utils/handlers'
import { CreateSupportBody, SupportParams, UpdateSupportBody } from '~/schemaValidations/support.schema'
import z from 'zod'

const supportRoutes = Router()

// Lấy danh sách góp ý (Yêu cầu quyền Admin/Manager/Sales)
supportRoutes.get(
  '/',
  requireLogined,
  requireManagerOrSales,
  wrapRequestHandler(getListSupportController)
)

// Tìm kiếm phiếu hỗ trợ của tôi qua email (Công khai)
supportRoutes.get(
  '/mine',
  wrapRequestHandler(getMySupportsController)
)

// Xem chi tiết phiếu hỗ trợ (Yêu cầu quyền Admin/Manager/Sales)
supportRoutes.get(
  '/:id',
  requireLogined,
  requireManagerOrSales,
  validateRequest(z.object({ params: SupportParams })),
  wrapRequestHandler(getDetailSupportController)
)

// Khách hàng gửi phản hồi mới (Công khai)
supportRoutes.post(
  '/',
  validateRequest(z.object({ body: CreateSupportBody })),
  wrapRequestHandler(createSupportController)
)

// Cập nhật trạng thái/phản hồi (Yêu cầu quyền Admin/Manager/Sales)
supportRoutes.put(
  '/:id',
  requireLogined,
  requireManagerOrSales,
  validateRequest(z.object({ params: SupportParams, body: UpdateSupportBody })),
  wrapRequestHandler(updateSupportController)
)

export default supportRoutes
