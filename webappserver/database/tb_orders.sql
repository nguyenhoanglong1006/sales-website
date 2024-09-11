-- Table: public.tb_orders
-- DROP TABLE IF EXISTS public.tb_orders;
CREATE TABLE IF NOT EXISTS public.tb_orders (
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY (
        INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1
    ),
    code character varying COLLATE pg_catalog."default" NOT NULL,
    customer_id integer NOT NULL,
    customer_address text COLLATE pg_catalog."default" NOT NULL,
    total_price double precision NOT NULL,
    total_sale double precision NOT NULL,
    total_payment double precision NOT NULL,
    phone character varying(20) COLLATE pg_catalog."default" NOT NULL,
    delivery_status smallint NOT NULL,
    checked smallint,
    note text COLLATE pg_catalog."default",
    status smallint,
    maker_id integer,
    maker_date timestamp without time zone,
    CONSTRAINT tb_cart_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

ALTER TABLE
    IF EXISTS public.tb_orders OWNER to postgres;

COMMENT ON TABLE public.tb_orders IS 'danh sách đơn hàng';

COMMENT ON COLUMN public.tb_orders.id IS 'Số sequence';

COMMENT ON COLUMN public.tb_orders.code IS 'Mã đơn hàng';

COMMENT ON COLUMN public.tb_orders.customer_id IS 'ID khách hàng';

COMMENT ON COLUMN public.tb_orders.customer_address IS 'Số sequence';

COMMENT ON COLUMN public.tb_orders.total_price IS 'Giá đơn hàng';

COMMENT ON COLUMN public.tb_orders.total_sale IS 'Giá sale';

COMMENT ON COLUMN public.tb_orders.total_payment IS 'Thành tiền';

COMMENT ON COLUMN public.tb_orders.phone IS 'Số điện thoại khách hàng';