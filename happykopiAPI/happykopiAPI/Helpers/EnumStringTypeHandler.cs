using Dapper;
using System;
using System.Data;

namespace happykopiAPI.Helpers
{
    public class EnumStringTypeHandler<TEnum> : SqlMapper.TypeHandler<TEnum> where TEnum : struct, Enum
    {
        public override TEnum Parse(object value) => Enum.Parse<TEnum>(value.ToString()!);
        public override void SetValue(IDbDataParameter parameter, TEnum value) => parameter.Value = value.ToString();
    }
}
