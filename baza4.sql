USE [baza4]
GO
/****** Object:  Table [dbo].[Table_products]    Script Date: 02.08.2018 15:45:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Table_products](
	[id] [numeric](18, 0) IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](50) NOT NULL,
	[description] [nvarchar](100) NULL,
	[price] [numeric](10, 2) NOT NULL,
 CONSTRAINT [PK_Table_products] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Table_products] ON 

INSERT [dbo].[Table_products] ([id], [name], [description], [price]) VALUES (CAST(1 AS Numeric(18, 0)), N'name1', N'description123', CAST(100.88 AS Numeric(10, 2)))
INSERT [dbo].[Table_products] ([id], [name], [description], [price]) VALUES (CAST(2 AS Numeric(18, 0)), N'name2a', NULL, CAST(33.20 AS Numeric(10, 2)))
INSERT [dbo].[Table_products] ([id], [name], [description], [price]) VALUES (CAST(3 AS Numeric(18, 0)), N'name3bxxx', N'description123', CAST(2.99 AS Numeric(10, 2)))
INSERT [dbo].[Table_products] ([id], [name], [description], [price]) VALUES (CAST(4 AS Numeric(18, 0)), N'name 44', N'desc 4', CAST(4.00 AS Numeric(10, 2)))
INSERT [dbo].[Table_products] ([id], [name], [description], [price]) VALUES (CAST(5 AS Numeric(18, 0)), N'nameww', N'desa', CAST(5.00 AS Numeric(10, 2)))
INSERT [dbo].[Table_products] ([id], [name], [description], [price]) VALUES (CAST(6 AS Numeric(18, 0)), N'dfdfdf', N'fgffg', CAST(7.60 AS Numeric(10, 2)))
INSERT [dbo].[Table_products] ([id], [name], [description], [price]) VALUES (CAST(7 AS Numeric(18, 0)), N'ttttttt', N'yyyyy', CAST(11.77 AS Numeric(10, 2)))
INSERT [dbo].[Table_products] ([id], [name], [description], [price]) VALUES (CAST(8 AS Numeric(18, 0)), N'rrrr', N'rrtgrtgtr', CAST(222.00 AS Numeric(10, 2)))
SET IDENTITY_INSERT [dbo].[Table_products] OFF
